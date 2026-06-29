"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  AINotes,
  Achievement,
  Document,
  Flashcard,
  MentorConversation,
  MentorMessage,
  Notification,
  OnboardingProfile,
  QuizAttempt,
  StudyTask,
  User,
} from "@/types";
import { loadState, saveState } from "@/lib/persist";
import { uid, now } from "@/lib/id";
import { newDocument, runProcessingPipeline } from "@/lib/processing-pipeline";
import { aiService } from "@/services/ai";

type AppState = {
  user: User | null;
  profile: OnboardingProfile | null;
  documents: Document[];
  notes: AINotes[];
  flashcards: Flashcard[];
  quizzes: QuizAttempt[];
  conversations: MentorConversation[];
  tasks: StudyTask[];
  achievements: Achievement[];
  notifications: Notification[];
};

const EMPTY: AppState = {
  user: null,
  profile: null,
  documents: [],
  notes: [],
  flashcards: [],
  quizzes: [],
  conversations: [],
  tasks: [],
  achievements: [],
  notifications: [],
};

type Ctx = AppState & {
  ready: boolean;
  // Auth
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (name: string, email: string, password: string) => Promise<User>;
  signInWithProvider: (provider: "google" | "github") => Promise<User>;
  signOut: () => void;
  // Onboarding
  completeOnboarding: (p: Omit<OnboardingProfile, "completedAt">) => void;
  // Upload + processing
  uploadAndProcess: (file: File) => Promise<{ documentId: string } | { error: string }>;
  // Notes
  bookmarkNote: (id: string, on: boolean) => void;
  regenerateNote: (noteId: string) => Promise<void>;
  // Flashcards
  reviewFlashcard: (id: string, grade: "again" | "hard" | "good" | "easy") => void;
  toggleFlashcardBookmark: (id: string) => void;
  generateMoreFlashcards: (documentId?: string) => Promise<void>;
  // Quiz
  startQuiz: (
    opts: {
      documentId?: string;
      mode?: "practice" | "adaptive" | "exam" | "custom";
      count?: number;
      difficulty?: "easy" | "medium" | "hard";
    },
  ) => Promise<QuizAttempt>;
  submitQuiz: (attemptId: string, answers: (number | null)[], durationSec: number) => void;
  // Mentor
  createConversation: (title?: string) => MentorConversation;
  sendMentorMessage: (
    conversationId: string,
    text: string,
    onToken?: (chunk: string) => void,
  ) => Promise<MentorMessage>;
  // Notifications
  markAllRead: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

const mockUser = (overrides: Partial<User> = {}): User => ({
  id: uid(),
  email: overrides.email ?? "student@studyspark.ai",
  name: overrides.name ?? "Alex Morgan",
  createdAt: now(),
  provider: overrides.provider ?? "email",
  avatarUrl: overrides.avatarUrl,
  ...overrides,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY);
  const [ready, setReady] = useState(false);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage once
  useEffect(() => {
    const raw = loadState();
    if (raw && typeof raw === "object") {
      setState({ ...EMPTY, ...(raw as Partial<AppState>) });
    }
    setReady(true);
  }, []);

  // Persist (debounced)
  useEffect(() => {
    if (!ready) return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => saveState(state as unknown as Record<string, unknown>), 250);
  }, [state, ready]);

  const notify = useCallback((n: Omit<Notification, "id" | "createdAt" | "read">) => {
    setState((s) => ({
      ...s,
      notifications: [
        { id: uid(), createdAt: now(), read: false, ...n },
        ...s.notifications,
      ].slice(0, 30),
    }));
  }, []);

  // --- Auth ---
  const signIn = useCallback(async (email: string, _password: string) => {
    const u = mockUser({ email, name: email.split("@")[0] || "Student" });
    setState((s) => ({ ...s, user: u }));
    return u;
  }, []);
  const signUp = useCallback(async (name: string, email: string, _password: string) => {
    const u = mockUser({ email, name });
    setState((s) => ({ ...s, user: u }));
    return u;
  }, []);
  const signInWithProvider = useCallback(async (provider: "google" | "github") => {
    const u = mockUser({
      email: provider === "google" ? "you@gmail.com" : "you@github.com",
      name: provider === "google" ? "Google User" : "GitHub User",
      provider,
    });
    setState((s) => ({ ...s, user: u }));
    return u;
  }, []);
  const signOut = useCallback(() => setState(EMPTY), []);

  // --- Onboarding ---
  const completeOnboarding = useCallback(
    (p: Omit<OnboardingProfile, "completedAt">) => {
      setState((s) => ({ ...s, profile: { ...p, completedAt: now() } }));
      notify({ kind: "success", title: "Profile set up", body: "Your study plan is ready." });
    },
    [notify],
  );

  // --- Upload + processing pipeline ---
  const updateDoc = useCallback((id: string, patch: Partial<Document>) => {
    setState((s) => ({
      ...s,
      documents: s.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));
  }, []);

  const uploadAndProcess = useCallback(
    async (file: File): Promise<{ documentId: string } | { error: string }> => {
      const userId = state.user?.id ?? "anon";
      const doc = newDocument(file, userId);
      setState((s) => ({ ...s, documents: [doc, ...s.documents] }));
      try {
        const result = await runProcessingPipeline(doc, file, (stage) =>
          updateDoc(doc.id, {
            status: stage.status,
            progress: stage.progress,
            stageLabel: stage.label,
          }),
        );
        setState((s) => ({
          ...s,
          notes: [result.notes, ...s.notes],
          flashcards: [...result.flashcards, ...s.flashcards],
        }));
        notify({
          kind: "success",
          title: "Study set ready",
          body: `${doc.title} → notes + ${result.flashcards.length} cards.`,
        });
        return { documentId: doc.id };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Processing failed.";
        updateDoc(doc.id, { status: "failed", errorMessage: msg });
        notify({ kind: "warning", title: "Processing failed", body: msg });
        return { error: msg };
      }
    },
    [state.user?.id, updateDoc, notify],
  );

  // --- Notes ---
  const bookmarkNote = useCallback((id: string, on: boolean) => {
    setState((s) => ({
      ...s,
      notes: s.notes.map((n) => (n.id === id ? { ...n, bookmarked: on } : n)),
    }));
  }, []);
  const regenerateNote = useCallback(async (noteId: string) => {
    const note = state.notes.find((n) => n.id === noteId);
    if (!note) return;
    const fresh = await aiService.generateNotes({
      documentId: note.documentId,
      text: note.sections.summary,
      title: note.title,
    });
    setState((s) => ({
      ...s,
      notes: s.notes.map((n) =>
        n.id === noteId
          ? { ...fresh, id: n.id, version: n.version + 1, bookmarked: n.bookmarked }
          : n,
      ),
    }));
  }, [state.notes]);

  // --- Flashcards (lightweight spaced repetition) ---
  const reviewFlashcard = useCallback((id: string, grade: "again" | "hard" | "good" | "easy") => {
    const intervals = { again: 0.5, hard: 1, good: 3, easy: 7 } as const;
    const conf = { again: -0.15, hard: -0.05, good: 0.1, easy: 0.2 } as const;
    setState((s) => ({
      ...s,
      flashcards: s.flashcards.map((c) => {
        if (c.id !== id) return c;
        const next = new Date();
        next.setHours(next.getHours() + intervals[grade] * 24);
        return {
          ...c,
          reviewCount: c.reviewCount + 1,
          confidence: Math.max(0, Math.min(1, c.confidence + conf[grade])),
          lastReviewed: now(),
          nextReview: next.toISOString(),
        };
      }),
    }));
  }, []);
  const toggleFlashcardBookmark = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      flashcards: s.flashcards.map((c) =>
        c.id === id ? { ...c, bookmarked: !c.bookmarked } : c,
      ),
    }));
  }, []);
  const generateMoreFlashcards = useCallback(async (documentId?: string) => {
    const cards = await aiService.generateFlashcards({
      documentId: documentId ?? state.documents[0]?.id ?? "demo",
      count: 8,
    });
    setState((s) => ({ ...s, flashcards: [...cards, ...s.flashcards] }));
  }, [state.documents]);

  // --- Quiz ---
  const startQuiz = useCallback<Ctx["startQuiz"]>(
    async ({ documentId, mode = "practice", count = 6, difficulty = "medium" }) => {
      const qs = await aiService.generateQuiz({
        documentId: documentId ?? state.documents[0]?.id ?? "demo",
        count,
        difficulty,
      });
      const attempt: QuizAttempt = {
        id: uid(),
        documentId,
        mode,
        questions: qs,
        answers: new Array(qs.length).fill(null),
        score: 0,
        durationSec: 0,
        createdAt: now(),
      };
      setState((s) => ({ ...s, quizzes: [attempt, ...s.quizzes] }));
      return attempt;
    },
    [state.documents],
  );
  const submitQuiz = useCallback((attemptId: string, answers: (number | null)[], durationSec: number) => {
    setState((s) => {
      const next = s.quizzes.map((a) => {
        if (a.id !== attemptId) return a;
        const correct = a.questions.reduce(
          (acc, q, i) => acc + (answers[i] === q.answerIndex ? 1 : 0),
          0,
        );
        const score = Math.round((correct / a.questions.length) * 100);
        return { ...a, answers, durationSec, score };
      });
      return { ...s, quizzes: next };
    });
    notify({ kind: "success", title: "Quiz scored", body: "Your dashboard is updated." });
  }, [notify]);

  // --- Mentor ---
  const createConversation = useCallback((title?: string) => {
    const convo: MentorConversation = {
      id: uid(),
      title: title ?? "New conversation",
      messages: [],
      createdAt: now(),
    };
    setState((s) => ({ ...s, conversations: [convo, ...s.conversations] }));
    return convo;
  }, []);

  const sendMentorMessage = useCallback<Ctx["sendMentorMessage"]>(
    async (conversationId, text, onToken) => {
      const userMsg: MentorMessage = {
        id: uid(),
        role: "user",
        content: text,
        createdAt: now(),
      };
      const assistantId = uid();
      setState((s) => ({
        ...s,
        conversations: s.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                title: c.messages.length === 0 ? text.slice(0, 60) : c.title,
                messages: [
                  ...c.messages,
                  userMsg,
                  { id: assistantId, role: "assistant", content: "", createdAt: now() },
                ],
              }
            : c,
        ),
      }));

      const history =
        state.conversations.find((c) => c.id === conversationId)?.messages ?? [];
      const handle = aiService.mentorResponse({ history, message: text });

      let acc = "";
      for await (const tok of handle.text) {
        acc += tok;
        onToken?.(tok);
        setState((s) => ({
          ...s,
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantId ? { ...m, content: acc } : m,
                  ),
                }
              : c,
          ),
        }));
      }
      return { id: assistantId, role: "assistant", content: acc, createdAt: now() };
    },
    [state.conversations],
  );

  const markAllRead = useCallback(
    () => setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
    [],
  );

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      ready,
      signIn,
      signUp,
      signInWithProvider,
      signOut,
      completeOnboarding,
      uploadAndProcess,
      bookmarkNote,
      regenerateNote,
      reviewFlashcard,
      toggleFlashcardBookmark,
      generateMoreFlashcards,
      startQuiz,
      submitQuiz,
      createConversation,
      sendMentorMessage,
      markAllRead,
    }),
    [
      state,
      ready,
      signIn,
      signUp,
      signInWithProvider,
      signOut,
      completeOnboarding,
      uploadAndProcess,
      bookmarkNote,
      regenerateNote,
      reviewFlashcard,
      toggleFlashcardBookmark,
      generateMoreFlashcards,
      startQuiz,
      submitQuiz,
      createConversation,
      sendMentorMessage,
      markAllRead,
    ],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

// Derived selectors

export function useExamReadiness() {
  const { quizzes, flashcards } = useApp();
  return useMemo(() => {
    const recent = quizzes.slice(0, 5);
    const quizAvg =
      recent.length === 0
        ? 65
        : Math.round(recent.reduce((a, q) => a + q.score, 0) / recent.length);
    const cardConf =
      flashcards.length === 0
        ? 0.6
        : flashcards.reduce((a, c) => a + c.confidence, 0) / flashcards.length;
    const score = Math.round(quizAvg * 0.6 + cardConf * 100 * 0.4);
    return { score: Math.max(0, Math.min(100, score)), trend: "up" as const };
  }, [quizzes, flashcards]);
}
