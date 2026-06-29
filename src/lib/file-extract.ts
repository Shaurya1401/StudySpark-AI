// Lightweight text extraction. PDFs/DOCX/PPTX are not parsed client-side here —
// when Gemini + a server function arrive, this is where extraction wires in.
// For now plain text is read directly; other formats yield a synthetic preview
// so the AI pipeline always has material to work with.

export async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".txt") || file.type.startsWith("text/")) {
    return await file.text();
  }
  // Synthetic placeholder preserving the title so AI prompts remain meaningful.
  return [
    `Title: ${file.name}`,
    `Size: ${(file.size / 1024).toFixed(1)} KB`,
    `Type: ${file.type || "binary"}`,
    "",
    "Document content is available once server-side extraction is wired up.",
    "The processing pipeline below operates against this metadata for now,",
    "producing structured notes, flashcards and quizzes using the same code paths",
    "that will run against real extracted text in production.",
  ].join("\n");
}

export const SUPPORTED_EXTS = [".pdf", ".docx", ".pptx", ".txt"] as const;
export const MAX_FILE_BYTES = 25 * 1024 * 1024; // 25 MB

export type ValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export function validateFile(file: File): ValidationResult {
  const lower = file.name.toLowerCase();
  const okExt = SUPPORTED_EXTS.some((e) => lower.endsWith(e));
  if (!okExt) return { ok: false, message: "This file type isn't supported yet." };
  if (file.size > MAX_FILE_BYTES)
    return { ok: false, message: "Your file exceeds the 25 MB upload limit." };
  if (file.size === 0) return { ok: false, message: "The selected file appears to be empty." };
  return { ok: true };
}
