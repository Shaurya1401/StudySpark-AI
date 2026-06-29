import { createFileRoute } from "@tanstack/react-router";
import { MentorView } from "@/components/mentor/mentor-view";

export const Route = createFileRoute("/mentor")({
  head: () => ({ meta: [{ title: "AI Mentor · StudySpark AI" }] }),
  component: MentorView,
});
