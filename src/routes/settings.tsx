"use client";

import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/app-shell";
import { useApp } from "@/state/app-store";
import { SparkButton } from "@/components/ui/spark-button";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · StudySpark AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { signOut } = useApp();
  return (
    <AppShell>
      <div className="grid grid-cols-12 gap-4">
        <header className="col-span-12 glass-strong rounded-3xl p-6 md:p-8">
          <h1 className="font-display text-2xl md:text-3xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Theme, notifications, AI behaviour and account controls.
          </p>
        </header>

        <Section title="Appearance">
          <Item label="Theme" hint="Dark, liquid-glass theme is enabled by default." />
          <Item label="Reduced motion" hint="Automatically respected from your OS settings." />
        </Section>
        <Section title="Notifications">
          <Item label="In-app updates" hint="Get a quiet ping when AI processing finishes." />
        </Section>
        <Section title="AI behaviour">
          <Item label="Mentor tone" hint="Calm, supportive academic mentor." />
          <Item label="Default difficulty" hint="Adapts to your performance over time." />
        </Section>

        <section className="col-span-12 glass rounded-3xl p-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="font-display font-semibold">Reset local data</div>
            <div className="text-sm text-muted-foreground">
              Sign out and clear the locally cached study data on this device.
            </div>
          </div>
          <SparkButton
            variant="outline"
            onClick={() => {
              signOut();
              if (typeof window !== "undefined") window.localStorage.removeItem("studyspark:v1");
              toast.success("Local data cleared.");
            }}
          >
            Clear & sign out
          </SparkButton>
        </section>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="col-span-12 lg:col-span-6 glass rounded-3xl p-6">
      <h3 className="font-display font-semibold">{title}</h3>
      <div className="mt-3 space-y-2">{children}</div>
    </section>
  );
}

function Item({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="glass-subtle rounded-xl px-3 py-3">
      <div className="text-sm">{label}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>
    </div>
  );
}
