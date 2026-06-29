// Shared domain types used across services, store and UI.

export type ID = string;
export type ISODate = string;

export type User = {
  id: ID;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: ISODate;
  provider?: "email" | "google" | "github";
};

export type OnboardingProfile = {
  course: string;
  semester: string;
  subjects: string[];
  examDate?: ISODate;
  dailyStudyMinutes: number;
  goals: string[];
  learningStyle: "visual" | "reading" | "auditory" | "kinesthetic" | "mixed";
  completedAt: ISODate;
};

export type Subject = {
  id: ID;
  name: string;
  color?: string;
};

export type DocumentStatus =
  | "queued"
  | "uploading"
  | "extracting"
  | "chunking"
  | "analyzing"
  | "structuring"
  | "ready"
  | "failed";

export type Document = {
  id: ID;
  userId: ID;
  title: string;
  filename: string;
  mime: string;
  sizeBytes: number;
  pages?: number;
  subjectId?: ID;
  status: DocumentStatus;
  progress: number; // 0..100
  stageLabel?: string;
  errorMessage?: string;
  createdAt: ISODate;
};

export type NoteSection =
  | "summary"
  | "objectives"
  | "concepts"
  | "definitions"
  | "formulae"
  | "examples"
  | "code"
  | "checklist"
  | "faq"
  | "onePage";

export type AINotes = {
  id: ID;
  documentId: ID;
  title: string;
  sections: Record<NoteSection, string>;
  bookmarked: boolean;
  createdAt: ISODate;
  version: number;
};

export type Flashcard = {
  id: ID;
  documentId?: ID;
  question: string;
  answer: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  confidence: number; // 0..1
  reviewCount: number;
  lastReviewed?: ISODate;
  nextReview: ISODate;
  bookmarked?: boolean;
};

export type QuizQuestion = {
  id: ID;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
};

export type QuizMode = "practice" | "adaptive" | "exam" | "custom";

export type QuizAttempt = {
  id: ID;
  documentId?: ID;
  mode: QuizMode;
  questions: QuizQuestion[];
  answers: (number | null)[];
  score: number; // 0..100
  durationSec: number;
  createdAt: ISODate;
};

export type StudyTask = {
  id: ID;
  title: string;
  subjectId?: ID;
  durationMin: number;
  scheduledFor: ISODate;
  completed: boolean;
};

export type ExamReadiness = {
  score: number; // 0..100
  trend: "up" | "down" | "flat";
  weakTopics: string[];
};

export type MentorMessage = {
  id: ID;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: ISODate;
};

export type MentorConversation = {
  id: ID;
  title: string;
  messages: MentorMessage[];
  createdAt: ISODate;
};

export type Notification = {
  id: ID;
  title: string;
  body?: string;
  read: boolean;
  createdAt: ISODate;
  kind: "info" | "success" | "warning";
};

export type Achievement = {
  id: ID;
  label: string;
  earnedAt: ISODate;
};
