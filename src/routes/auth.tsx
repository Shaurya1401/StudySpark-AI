import { createFileRoute } from "@tanstack/react-router";
import { AuthPanel } from "@/components/auth/auth-panel";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in · StudySpark AI" }] }),
  component: () => <AuthPanel />,
});
