// Mock AI provider — deterministic, dependency-free.
// Drives the same code paths a real Gemini provider will run through.

import type {
  AIService,
  AnswerQuestionInput,
  BuildStudyPlanInput,
  ExplainConceptInput,
  GenerateFlashcardsInput,
  GenerateNotesInput,
  GenerateQuizInput,
  MentorInput,
  StreamHandle,
  SummarizeInput,
} from "./types";
import type {
  AINotes,
  ExamReadiness,
  Flashcard,
  QuizQuestion,
  StudyTask,
} from "@/types";
import { uid, now } from "@/lib/id";

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// Derive faux topic names from incoming text so cards/quizzes feel tailored.
function topicsFromText(text: string): string[] {
  const words = text
    .split(/[^a-zA-Z]+/)
    .filter((w) => w.length > 5)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
  const seen = new Set<string>();
  const out: string[] = [];
  for (const w of words) {
    if (seen.has(w)) continue;
    seen.add(w);
    out.push(w);
    if (out.length >= 8) break;
  }
  while (out.length < 4)
    out.push(["Foundations", "Patterns", "Applications", "Theory"][out.length]!);
  return out;
}

export const mockAIService: AIService = {
  async generateNotes({ documentId, title, text }: GenerateNotesInput): Promise<AINotes> {
    await delay(450);
    const topics = topicsFromText(text);
    const t = title ?? "this document";
    return {
      id: uid(),
      documentId,
      title: t,
      bookmarked: false,
      version: 1,
      createdAt: now(),
      sections: {
        summary: `This study set distills ${t} into the ideas that matter most. The material centres on ${topics.slice(0, 3).join(", ")} and traces how each concept connects to the others. Read the executive summary first, then dive into the concept map. The goal is fluency, not memorisation: by the end of one focused session you should be able to explain the core ideas to a peer without notes.`,
        objectives: topics
          .slice(0, 5)
          .map((t, i) => `${i + 1}. Understand ${t} and when it applies.`)
          .join("\n"),
        concepts: topics
          .map(
            (t) =>
              `• **${t}** — short, student-friendly explanation of ${t} and why it matters in practice.`,
          )
          .join("\n"),
        definitions: topics
          .slice(0, 4)
          .map((t) => `**${t}** — a concise, exam-ready definition rewritten in plain language.`)
          .join("\n\n"),
        formulae: "E = mc²\nF = ma\nT(n) = aT(n/b) + f(n)",
        examples: `Worked example for **${topics[0]}**:\n1. Identify the inputs.\n2. Apply the core idea.\n3. Verify the result against an edge case.`,
        code: `// Worked snippet illustrating ${topics[0]}\nfunction solve(input) {\n  // ...\n  return result;\n}`,
        checklist: topics.map((t) => `[ ] Can explain ${t} in plain English`).join("\n"),
        faq: `**Q:** Where does ${topics[0]} show up in real systems?\n**A:** Anywhere you need to balance correctness and speed — see the worked example above.`,
        onePage: `# ${t} — one-page revision\n\n${topics.slice(0, 6).map((x) => `- ${x}`).join("\n")}`,
      },
    };
  },

  async generateFlashcards({ count = 12, documentId }: GenerateFlashcardsInput): Promise<Flashcard[]> {
    await delay(350);
    const topics = ["Foundations", "Patterns", "Applications", "Theory", "Edge Cases"];
    return Array.from({ length: count }).map((_, i) => ({
      id: uid(),
      documentId,
      question: `Explain the key idea behind ${topics[i % topics.length]} #${i + 1}.`,
      answer: `A focused, student-friendly explanation tied to your uploaded material.`,
      topic: topics[i % topics.length]!,
      difficulty: (["easy", "medium", "hard"] as const)[i % 3],
      confidence: 0.5,
      reviewCount: 0,
      nextReview: now(),
    }));
  },

  async generateQuiz({
    count = 8,
    difficulty = "medium",
  }: GenerateQuizInput): Promise<QuizQuestion[]> {
    await delay(400);
    const topics = ["Foundations", "Patterns", "Applications", "Theory"];
    return Array.from({ length: count }).map((_, i) => {
      const answerIndex = (i * 3 + 1) % 4;
      return {
        id: uid(),
        prompt: `Which statement best describes the ${topics[i % topics.length]?.toLowerCase()} principle from your material?`,
        options: [
          "It guarantees the smallest possible memory footprint.",
          "It trades work upfront for faster repeated queries.",
          "It only applies when the input is already sorted.",
          "It is equivalent to brute-force search in all cases.",
        ],
        answerIndex,
        explanation:
          "The correct option matches the worked example in your notes; the others swap cause and effect.",
        topic: topics[i % topics.length]!,
        difficulty,
      };
    });
  },

  async explainConcept({ concept }: ExplainConceptInput) {
    await delay(180);
    return `${concept} explained simply: imagine you're teaching a friend in two sentences. Use an analogy first, then ground it with a concrete example from your own notes.`;
  },

  async answerQuestion({ question }: AnswerQuestionInput) {
    await delay(180);
    return `Here is a focused answer to "${question}" grounded in your uploaded material.`;
  },

  async summarizeDocument({ text }: SummarizeInput) {
    await delay(180);
    return text.slice(0, 280) + (text.length > 280 ? "…" : "");
  },

  async buildStudyPlan({ days, hoursPerDay, subjects }: BuildStudyPlanInput): Promise<StudyTask[]> {
    await delay(220);
    const tasks: StudyTask[] = [];
    for (let d = 0; d < days; d++) {
      subjects.forEach((s, i) => {
        const date = new Date();
        date.setDate(date.getDate() + d);
        tasks.push({
          id: uid(),
          title: `${s} focused block`,
          durationMin: Math.round((hoursPerDay * 60) / Math.max(1, subjects.length)),
          scheduledFor: date.toISOString(),
          completed: false,
          subjectId: String(i),
        });
      });
    }
    return tasks;
  },

  async analyzePerformance() {
    await delay(180);
    return {
      insights: [
        "Your retention on the most recent topic improved this week.",
        "Consider revisiting the weakest topic — recent quiz accuracy dropped.",
        "You learn best between 9–11am based on session data.",
      ],
    };
  },

  async calculateExamReadiness(): Promise<ExamReadiness> {
    await delay(120);
    return { score: 72, trend: "up", weakTopics: ["Probability", "Graph Theory"] };
  },

  mentorResponse({ message }: MentorInput): StreamHandle<string> {
    // Tailor the reply a little to the question for a coachier feel.
    const lower = message.toLowerCase();
    let reply: string;
    if (lower.includes("ready") || lower.includes("exam")) {
      reply = `You're trending in the right direction. Based on your last quizzes I'd focus tonight on your two weakest topics — short focused recall, then a six-question adaptive quiz. I'll schedule a review for Friday morning.`;
    } else if (lower.includes("plan") || lower.includes("today")) {
      reply = `Here's a tight plan: 25 minutes of focused recall on your weakest topic, a six-question adaptive quiz, then ten minutes of flashcards. Short, deliberate, and aligned to what your data says will move the needle most.`;
    } else if (lower.includes("explain")) {
      reply = `Let's break that down. Start with the one-line idea, then the analogy from your notes, then a worked example. Tell me where it gets fuzzy and I'll zoom into that step specifically.`;
    } else {
      reply = `Great question. Let's break "${message}" into smaller steps so it feels manageable. First, anchor it to something you already know; then build outward one concept at a time.`;
    }
    let cancelled = false;
    const text = (async function* () {
      for (const word of reply.split(" ")) {
        if (cancelled) return;
        await delay(28);
        yield word + " ";
      }
    })();
    return {
      text,
      result: Promise.resolve(reply),
      cancel: () => {
        cancelled = true;
      },
    };
  },
};
