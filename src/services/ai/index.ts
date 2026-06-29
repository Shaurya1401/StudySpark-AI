import type { AIService } from "./types";
import { mockAIService } from "./mockProvider";

// Single entry point. Swap implementation here when Gemini server fn is ready.
export const aiService: AIService = mockAIService;

export * from "./types";
