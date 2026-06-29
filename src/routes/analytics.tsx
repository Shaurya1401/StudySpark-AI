"use client";

import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/dashboard/app-shell";
import { Ring } from "@/components/ui/ring";
import { Heatmap } from "@/components/ui/heatmap";
import { useApp, useExamReadiness } from "@/state/app-store";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics · StudySpark AI" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { flashcards, quizzes, notes } = useApp();
  const readiness = useExamReadiness();

  const topicMastery = useMemo(() => {
    const map = new Map<string, { sum: number; n: number }>();
    flashcards.forEach((c) => {
      const e = map.get(c.topic) ?? { sum: 0, n: 0 };
      e.sum += c.confidence;
      e.n += 1;
      map.set(c.topic, e);
    });
    return [...map.entries()].map(([t, v]) => ({ topic: t, score: Math.round((v.sum / v.n) * 100) }));
  }, [flashcards]);

  const avgScore = quizzes.length
    ? Math.round(quizzes.reduce((a, q) => a + q.score, 0) / quizzes.length)
    : 0;

  return (
    <AppShell>
      <div className="grid grid-cols-12 gap-4">
        <header className="col-span-12 glass-strong rounded-3xl p-6 md:p-8">
          <h1 className="font-display text-2xl md:text-3xl font-semibold">Learning analytics</h1>
          <p className="text-sm text-muted-foreground">
            How you study, how you retain, and where to focus next.
          </p>
        </header>

        <section className="col-span-12 lg:col-span-4 glass rounded-3xl p-6 flex flex-col items-center">
          <Ring value={readiness.score} size={160} stroke={12} label="Exam readiness" sub="composite score" />
        </section>
        <section className="col-span-12 lg:col-span-4 glass rounded-3xl p-6 flex flex-col items-center">
          <Ring value={avgScore} size={160} stroke={12} label="Quiz accuracy" sub={`${quizzes.length} attempts`} />
        </section>
        <section className="col-span-12 lg:col-span-4 glass rounded-3xl p-6 flex flex-col items-center">
          <Ring
            value={Math.round(
              (flashcards.reduce((a, c) => a + c.confidence, 0) / Math.max(1, flashcards.length)) * 100,
            )}
            size={160}
            stroke={12}
            label="Card confidence"
            sub={`${flashcards.length} cards`}
          />
        </section>

        <section className="col-span-12 lg:col-span-7 glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold">Topic mastery</h3>
            <span className="text-xs text-muted-foreground">{topicMastery.length} topics tracked</span>
          </div>
          <ul className="mt-4 space-y-2">
            {topicMastery.length === 0 && (
              <li className="text-sm text-muted-foreground">Generate flashcards to begin tracking.</li>
            )}
            {topicMastery.map((t) => (
              <li key={t.topic} className="glass-subtle rounded-xl p-3">
                <div className="flex items-center justify-between text-sm">
                  <span>{t.topic}</span>
                  <span className="font-mono text-xs text-muted-foreground">{t.score}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full gradient-primary" style={{ width: `${t.score}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="col-span-12 lg:col-span-5 glass rounded-3xl p-6">
          <h3 className="font-display font-semibold">Study activity</h3>
          <Heatmap className="mt-5" />
          <div className="mt-4 text-xs text-muted-foreground">
            {notes.length} study set{notes.length === 1 ? "" : "s"} · {flashcards.length} cards in rotation
          </div>
        </section>
      </div>
    </AppShell>
  );
}
