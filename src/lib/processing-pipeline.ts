// Orchestrates the visible "Upload → Extract → Chunk → Analyze → Structure → Save" pipeline.
// Emits stage events the UI can subscribe to so progress is always visible.

import { aiService } from "@/services/ai";
import { extractText } from "@/lib/file-extract";
import { chunkText } from "@/services/ai/responseParser";
import type { AINotes, Document, DocumentStatus, Flashcard, QuizQuestion } from "@/types";
import { uid } from "@/lib/id";

export type PipelineStage = {
  status: DocumentStatus;
  progress: number;
  label: string;
};

export type PipelineResult = {
  notes: AINotes;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
};

const stages: PipelineStage[] = [
  { status: "uploading", progress: 10, label: "Uploading…" },
  { status: "extracting", progress: 25, label: "Reading document…" },
  { status: "chunking", progress: 40, label: "Understanding structure…" },
  { status: "analyzing", progress: 65, label: "Generating notes…" },
  { status: "structuring", progress: 85, label: "Creating flashcards & quiz…" },
  { status: "ready", progress: 100, label: "Complete" },
];

export async function runProcessingPipeline(
  doc: Document,
  file: File,
  onStage: (s: PipelineStage) => void,
): Promise<PipelineResult> {
  // 1. Uploading (simulated — Supabase Storage wires here in Batch 3)
  onStage(stages[0]!);
  await new Promise((r) => setTimeout(r, 400));

  // 2. Extract text
  onStage(stages[1]!);
  const text = await extractText(file);

  // 3. Chunk
  onStage(stages[2]!);
  const chunks = chunkText(text, 4000);
  await new Promise((r) => setTimeout(r, 250));

  // 4. Notes
  onStage(stages[3]!);
  const notes = await aiService.generateNotes({
    documentId: doc.id,
    text: chunks.join("\n\n"),
    title: doc.title,
  });

  // 5. Flashcards + quiz in parallel
  onStage(stages[4]!);
  const [flashcards, quiz] = await Promise.all([
    aiService.generateFlashcards({ documentId: doc.id, count: 12 }),
    aiService.generateQuiz({ documentId: doc.id, count: 8, difficulty: "medium" }),
  ]);

  // 6. Done
  onStage(stages[5]!);

  return { notes, flashcards, quiz };
}

export function newDocument(file: File, userId: string): Document {
  return {
    id: uid(),
    userId,
    title: file.name.replace(/\.[^.]+$/, ""),
    filename: file.name,
    mime: file.type || "application/octet-stream",
    sizeBytes: file.size,
    status: "queued",
    progress: 0,
    createdAt: new Date().toISOString(),
  };
}
