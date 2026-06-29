// AI Service Layer — UI never talks to a model provider directly.
// Implementations are swappable; current default is a deterministic mock.

import type {
  AINotes,
  ExamReadiness,
  Flashcard,
  MentorMessage,
  QuizQuestion,
  StudyTask,
} from "@/types";

export type GenerateNotesInput = { documentId: string; text: string; title?: string };
export type GenerateFlashcardsInput = { documentId: string; topics?: string[]; count?: number };
export type GenerateQuizInput = { documentId: string; count?: number; difficulty?: "easy" | "medium" | "hard" };
export type ExplainConceptInput = { concept: string; context?: string };
export type AnswerQuestionInput = { question: string; context?: string };
export type SummarizeInput = { text: string };
export type BuildStudyPlanInput = { hoursPerDay: number; days: number; subjects: string[] };
export type MentorInput = { history: MentorMessage[]; message: string };

export type StreamHandle<T> = {
  readonly text: AsyncIterable<string>;
  result: Promise<T>;
  cancel(): void;
};

export interface AIService {
  generateNotes(input: GenerateNotesInput): Promise<AINotes>;
  generateFlashcards(input: GenerateFlashcardsInput): Promise<Flashcard[]>;
  generateQuiz(input: GenerateQuizInput): Promise<QuizQuestion[]>;
  explainConcept(input: ExplainConceptInput): Promise<string>;
  answerQuestion(input: AnswerQuestionInput): Promise<string>;
  summarizeDocument(input: SummarizeInput): Promise<string>;
  buildStudyPlan(input: BuildStudyPlanInput): Promise<StudyTask[]>;
  analyzePerformance(): Promise<{ insights: string[] }>;
  calculateExamReadiness(): Promise<ExamReadiness>;
  mentorResponse(input: MentorInput): StreamHandle<string>;
}
