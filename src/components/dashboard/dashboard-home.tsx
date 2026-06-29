"use client";

import { motion } from "framer-motion";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  Flame,
  Trophy,
  CalendarRange,
  Brain,
  Layers,
  Upload,
  ArrowRight,
  Clock3,
  BookOpenCheck,
  Zap,
  FileText,
} from "lucide-react";
import { Ring } from "@/components/ui/ring";
import { Heatmap } from "@/components/ui/heatmap";
import { SparkButton } from "@/components/ui/spark-button";
import { useApp, useExamReadiness } from "@/state/app-store";

export function DashboardHome() {
  const { user, notes, flashcards, quizzes, documents } = useApp();
  const readiness = useExamReadiness();
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const mastered = new Set(flashcards.filter((f) => f.confidence > 0.75).map((f) => f.topic)).size;
  const lastQuiz = quizzes[0];

  return (
    <div className="grid grid-cols-12 gap-4">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="col-span-12 glass rounded-3xl p-6 md:p-8 flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <div className="text-xs text-muted-foreground">Good to see you</div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
            Welcome back, <span className="gradient-text">{firstName}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            {notes.length === 0
              ? "Upload your first document to unlock notes, flashcards, quizzes and a personalized study plan."
              : `You have ${notes.length} active study ${notes.length === 1 ? "set" : "sets"} and ${flashcards.length} flashcards in rotation.`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/notes">
            <SparkButton variant="glass" leadingIcon={<Upload className="size-4" />}>
              Upload material
            </SparkButton>
          </Link>
          <SparkButton
            trailingIcon={<ArrowRight className="size-4" />}
            onClick={() => navigate({ to: "/quiz" })}
          >
            Start session
          </SparkButton>
        </div>
      </motion.section>

      <section className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: BookOpenCheck, label: "Review notes", to: "/notes" },
          { icon: Layers, label: "Practice cards", to: "/flashcards" },
          { icon: Brain, label: "Take a quiz", to: "/quiz" },
          { icon: Sparkles, label: "Ask AI Mentor", to: "/mentor" },
        ].map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="glass glass-hover rounded-2xl p-4 flex items-center gap-3 text-left"
          >
            <span className="grid place-items-center size-10 rounded-xl glass-subtle">
              <a.icon className="size-5 text-primary" />
            </span>
            <span className="font-medium text-sm">{a.label}</span>
          </Link>
        ))}
      </section>

      <section className="col-span-12 lg:col-span-4 glass rounded-3xl p-6 flex flex-col items-center justify-center">
        <Ring value={readiness.score} size={160} stroke={12} label="Exam Readiness" sub="updates as you study" />
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {["Probability", "Graph Theory"].map((t) => (
            <span
              key={t}
              className="text-[11px] px-2.5 py-1 rounded-full glass-subtle text-muted-foreground"
            >
              Weak: {t}
            </span>
          ))}
        </div>
      </section>

      <section className="col-span-12 lg:col-span-8 glass rounded-3xl p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">AI Mentor</span>
        </div>
        <p className="mt-3 text-base leading-relaxed">
          {lastQuiz
            ? `Your last quiz scored ${lastQuiz.score}%. A 25-minute focused recall on your weakest topic — then a six-question adaptive quiz — will move the needle most.`
            : `Upload a document to get a personalized session recommendation. I'll plan your time around your weak topics and exam date.`}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/mentor">
            <SparkButton size="sm" variant="glass">Plan tonight's session</SparkButton>
          </Link>
          <Link to="/mentor">
            <SparkButton size="sm" variant="ghost">Ask a follow-up</SparkButton>
          </Link>
        </div>
      </section>

      <section className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Flame, label: "Day streak", value: "12" },
          { icon: Clock3, label: "Focus this week", value: "9.2h" },
          { icon: Zap, label: "Quizzes taken", value: String(quizzes.length) },
          { icon: Trophy, label: "Topics mastered", value: String(mastered) },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <s.icon className="size-4 text-primary" />
            <div className="mt-2 font-display text-2xl font-semibold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="col-span-12 lg:col-span-7 glass rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarRange className="size-4 text-primary" />
            <h3 className="font-display font-semibold">Recent uploads</h3>
          </div>
          <Link to="/notes" className="text-xs text-muted-foreground hover:text-foreground">
            View all →
          </Link>
        </div>
        {documents.length === 0 ? (
          <div className="mt-4 glass-subtle rounded-2xl p-6 text-sm text-muted-foreground text-center">
            No uploads yet — try the Notes page.
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {documents.slice(0, 4).map((d) => (
              <li
                key={d.id}
                className="flex items-center gap-3 glass-subtle rounded-2xl px-4 py-3"
              >
                <FileText className="size-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{d.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {d.status === "ready"
                      ? "Ready"
                      : d.status === "failed"
                        ? d.errorMessage
                        : (d.stageLabel ?? d.status)}
                  </div>
                </div>
                <span
                  className={
                    "size-2.5 rounded-full " +
                    (d.status === "ready"
                      ? "bg-success"
                      : d.status === "failed"
                        ? "bg-destructive"
                        : "bg-primary animate-pulse-glow")
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="col-span-12 lg:col-span-5 grid gap-4">
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold">Study activity</h3>
            <span className="text-xs text-muted-foreground font-mono">last 14 days</span>
          </div>
          <Heatmap className="mt-5" />
        </div>
        <div className="glass rounded-3xl p-6">
          <h3 className="font-display font-semibold">Recent achievements</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              `🔥 ${notes.length} study set${notes.length === 1 ? "" : "s"} generated`,
              `🎯 ${mastered} topic${mastered === 1 ? "" : "s"} mastered`,
              `🧠 ${quizzes.length} quiz attempt${quizzes.length === 1 ? "" : "s"}`,
            ].map((a) => (
              <li key={a} className="glass-subtle rounded-xl px-3 py-2">
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
