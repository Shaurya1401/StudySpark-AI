import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/app-shell";
import { DashboardHome } from "@/components/dashboard/dashboard-home";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · StudySpark AI" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppShell>
      <DashboardHome />
    </AppShell>
  );
}
