// Prompt Builder — keeps prompt templates in one place so providers can swap.

export const promptBuilder = {
  notes: (title: string, text: string) =>
    `You are an expert tutor. Transform the following study material titled "${title}" into structured learning notes with sections: Executive Summary, Key Concepts, Definitions, Formulae, Worked Examples, Code (if applicable), FAQ, Interview Questions, Revision Checklist, One-Page Revision Sheet. Prioritize understanding.\n\nMATERIAL:\n${text}`,
  flashcards: (text: string, count: number) =>
    `Create ${count} adaptive flashcards from this material. Each card must have a focused question and concise answer. Material:\n${text}`,
  quiz: (text: string, count: number, difficulty: string) =>
    `Generate ${count} ${difficulty} multiple-choice questions with 4 options and an explanation per item. Material:\n${text}`,
  explain: (concept: string, context?: string) =>
    `Explain the concept "${concept}" clearly with an analogy and a short example.${context ? `\nContext: ${context}` : ""}`,
  mentor: (history: string, message: string) =>
    `You are a calm, encouraging academic mentor. Keep responses focused and actionable.\n\nConversation:\n${history}\n\nStudent: ${message}\nMentor:`,
};
