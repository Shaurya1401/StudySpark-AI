import { createFileRoute } from "@tanstack/react-router";
import { NotesView } from "@/components/notes/notes-view";

export const Route = createFileRoute("/notes")({
  head: () => ({ meta: [{ title: "Notes · StudySpark AI" }] }),
  component: NotesView,
});
