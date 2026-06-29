"use client";

import { useMemo } from "react";
import { CalendarRange, Plus } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/state/app-store";
import { SparkButton } from "@/components/ui/spark-button";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Planner · StudySpark AI" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const { profile, documents, notes } = useApp();

  const today = useMemo(() => new Date(), []);
  const week = useMemo(() => {
    const days: Array<{ date: Date; tasks: Array<{ title: string; dur: number; done?: boolean }> }> = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const subjects = profile?.subjects ?? notes.map((n) => n.title).slice(0, 3);
      const minPerDay = profile?.dailyStudyMinutes ?? 90;
      const perBlock = Math.round(minPerDay / Math.max(1, subjects.length));
      days.push({
        date: d,
        tasks: subjects.map((s, idx) => ({
          title: `${s} · focused block`,
          dur: perBlock,
          done: i === 0 && idx === 0,
        })),
      });
    }
    return days;
  }, [today, profile, notes]);

  return (
    <AppShell>
      <div className="grid grid-cols-12 gap-4">
        <header className="col-span-12 glass-strong rounded-3xl p-6 md:p-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <CalendarRange className="size-4 text-primary" /> Planner
            </div>
            <h1 className="mt-1 font-display text-2xl md:text-3xl font-semibold">
              Your week, optimised
            </h1>
            <p className="text-sm text-muted-foreground">
              Blocks adapt as you upload material and complete reviews.
              {profile?.examDate && ` Exam: ${new Date(profile.examDate).toDateString()}`}
            </p>
          </div>
          <SparkButton leadingIcon={<Plus className="size-4" />}>Add block</SparkButton>
        </header>

        <section className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
          {week.map((d) => (
            <div key={d.date.toISOString()} className="glass rounded-2xl p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {d.date.toLocaleDateString(undefined, { weekday: "short" })}
              </div>
              <div className="font-display text-xl font-semibold">
                {d.date.getDate()}
              </div>
              <ul className="mt-3 space-y-1.5">
                {d.tasks.map((t, i) => (
                  <li key={i} className="glass-subtle rounded-xl px-3 py-2 text-xs">
                    <div className="truncate">{t.title}</div>
                    <div className="text-[10px] text-muted-foreground">{t.dur} min</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="col-span-12 glass rounded-3xl p-6 text-sm text-muted-foreground">
          {documents.length === 0
            ? "Upload material to refine your planner with subject-specific blocks."
            : `Your planner is built around ${documents.length} uploaded document${documents.length === 1 ? "" : "s"}.`}
        </section>
      </div>
    </AppShell>
  );
}
