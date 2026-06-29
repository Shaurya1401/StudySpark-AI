// Response Parser — defensive parsing of provider responses.

export function parseJSONSafely<T>(raw: string, fallback: T): T {
  try {
    // strip markdown fences
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

export function chunkText(text: string, chunkSize = 6000): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}
