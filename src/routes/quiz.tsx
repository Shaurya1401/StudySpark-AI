import { createFileRoute } from "@tanstack/react-router";
import { QuizView } from "@/components/quiz/quiz-view";

export const Route = createFileRoute("/quiz")({
  head: () => ({ meta: [{ title: "Quiz · StudySpark AI" }] }),
  component: QuizView,
});
