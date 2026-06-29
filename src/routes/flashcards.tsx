import { createFileRoute } from "@tanstack/react-router";
import { FlashcardsView } from "@/components/flashcards/flashcards-view";

export const Route = createFileRoute("/flashcards")({
  head: () => ({ meta: [{ title: "Flashcards · StudySpark AI" }] }),
  component: FlashcardsView,
});
