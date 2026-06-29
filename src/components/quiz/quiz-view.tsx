"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Brain, CheckCircle2, Clock3, Play, RotateCcw, XCircle } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { useApp } from "@/state/app-store";
import { SparkButton } from "@/components/ui/spark-button";
import { cn } from "@/lib/utils";
import type { QuizAttempt, QuizMode } from "@/types";
import { toast } from "sonner";

const MODES: Array<{ id: QuizMode; label: string; desc: string }> = [
  { id: "practice", label: "Practice", desc: "Unlimited, instant feedback" },
  { id: "adaptive", label: "Adaptive AI", desc: "Difficulty tunes to you" },
  { id: "exam", label: "Exam sim", desc: "Timed, locked navigation" },
  { id: "custom", label: "Custom", desc: "Pick subject & length" },
];

export function QuizView() {
  const { startQuiz, submitQuiz, quizzes } = useApp();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [elapsed, setElapsed] = useState(0);
  const [mode, setMode] = useState<QuizMode>("practice");
  const [count, setCount] = useState(6);

  useEffect(() => {
    if (!attempt || showReview) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(t);
  }, [attempt, showReview, startedAt]);

  async function begin() {
    const a = await startQuiz({ mode, count, difficulty: "medium" });
    setAttempt(a);
    setAnswers(new Array(a.questions.length).fill(null));
    setCurrent(0);
    setShowReview(false);
    setStartedAt(Date.now());
    setElapsed(0);
  }

  function answer(i: number) {
    if (!attempt) return;
    const next = [...answers];
    next[current] = i;
    setAnswers(next);
    if (mode === "practice") {
      // instant feedback — auto advance after a beat
      setTimeout(() => {
        if (current + 1 < attempt.questions.length) setCurrent(current + 1);
        else finish(next);
      }, 600);
    }
  }

  function finish(finalAnswers = answers) {
    if (!attempt) return;
    submitQuiz(attempt.id, finalAnswers, elapsed);
    setShowReview(true);
  }

  const score = useMemo(() => {
    if (!attempt) return 0;
    const correct = attempt.questions.reduce(
      (a, q, i) => a + (answers[i] === q.answerIndex ? 1 : 0),
      0,
    );
    return Math.round((correct / attempt.questions.length) * 100);
  }, [attempt, answers]);

  if (!attempt) {
    return (
      <AppShell>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 glass-strong rounded-3xl p-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Brain className="size-4 text-primary" /> Adaptive Quiz
            </div>
            <h1 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
              Choose how you want to be challenged tonight
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              Every quiz is generated from your uploaded material and your recent performance.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "glass glass-hover rounded-2xl p-4 text-left",
                    mode === m.id && "ring-2 ring-primary/60",
                  )}
                >
                  <div className="font-medium">{m.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{m.desc}</div>
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Questions</div>
                <div className="mt-1 flex gap-1.5">
                  {[5, 6, 8, 10, 15].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCount(c)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs",
                        count === c
                          ? "gradient-primary text-primary-foreground"
                          : "glass-subtle text-muted-foreground",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <SparkButton onClick={begin} leadingIcon={<Play className="size-4" />}>
                Start quiz
              </SparkButton>
            </div>
          </div>

          {quizzes.length > 0 && (
            <div className="col-span-12 glass rounded-3xl p-6">
              <h3 className="font-display font-semibold">Quiz history</h3>
              <ul className="mt-3 divide-y divide-white/5">
                {quizzes.slice(0, 8).map((q) => (
                  <li key={q.id} className="py-3 flex items-center gap-3 text-sm">
                    <span className="size-9 grid place-items-center rounded-xl glass-subtle text-primary">
                      <Brain className="size-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">
                        {q.mode} · {q.questions.length} questions
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(q.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="font-mono">{q.score}%</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </AppShell>
    );
  }

  if (showReview) {
    return (
      <AppShell>
        <div className="glass-strong rounded-3xl p-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Result</div>
              <h2 className="font-display text-2xl font-semibold">
                You scored <span className="gradient-text">{score}%</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                {score >= 80
                  ? "Strong run — let's lock it in with a quick flashcard review."
                  : "Good attempt. The AI Mentor can break down the misses with you."}
              </p>
            </div>
            <div className="flex gap-2">
              <SparkButton variant="glass" onClick={() => { setAttempt(null); setShowReview(false); }} leadingIcon={<RotateCcw className="size-4" />}>
                New quiz
              </SparkButton>
            </div>
          </div>

          <ul className="mt-6 space-y-3">
            {attempt.questions.map((q, i) => {
              const ok = answers[i] === q.answerIndex;
              return (
                <li key={q.id} className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {ok ? <CheckCircle2 className="size-4 text-success" /> : <XCircle className="size-4 text-destructive" />}
                    {q.topic} · {q.difficulty}
                  </div>
                  <div className="mt-1 font-medium">{q.prompt}</div>
                  <div className="mt-2 grid sm:grid-cols-2 gap-1.5 text-sm">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className={cn(
                          "rounded-xl px-3 py-2 glass-subtle",
                          oi === q.answerIndex && "ring-1 ring-success/50 text-success",
                          oi === answers[i] && oi !== q.answerIndex && "ring-1 ring-destructive/50 text-destructive",
                        )}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <div className="mt-2 text-xs text-muted-foreground">{q.explanation}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </AppShell>
    );
  }

  const q = attempt.questions[current]!;
  const progress = ((current + 1) / attempt.questions.length) * 100;

  return (
    <AppShell>
      <div className="glass-strong rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs text-muted-foreground">
            Question {current + 1} of {attempt.questions.length}
          </div>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" /> {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
            {String(elapsed % 60).padStart(2, "0")}
          </div>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full gradient-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>

        <h2 className="mt-6 font-display text-xl md:text-2xl font-semibold leading-snug">
          {q.prompt}
        </h2>

        <div className="mt-5 grid gap-2">
          {q.options.map((opt, i) => {
            const picked = answers[current] === i;
            const isCorrect = mode === "practice" && picked && i === q.answerIndex;
            const isWrong = mode === "practice" && picked && i !== q.answerIndex;
            return (
              <button
                key={i}
                disabled={mode === "practice" && answers[current] !== null}
                onClick={() => answer(i)}
                className={cn(
                  "text-left rounded-2xl px-4 py-3 glass glass-hover transition-all",
                  picked && "ring-2 ring-primary/60",
                  isCorrect && "ring-2 ring-success/70",
                  isWrong && "ring-2 ring-destructive/70",
                )}
              >
                <span className="text-xs font-mono text-muted-foreground mr-2">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-between">
          <SparkButton variant="ghost" disabled={current === 0} onClick={() => setCurrent(current - 1)}>
            Previous
          </SparkButton>
          {current + 1 < attempt.questions.length ? (
            <SparkButton onClick={() => setCurrent(current + 1)}>Next</SparkButton>
          ) : (
            <SparkButton
              onClick={() => {
                if (answers.some((a) => a === null)) {
                  toast.warning("Answer all questions before submitting.");
                  return;
                }
                finish();
              }}
            >
              Submit quiz
            </SparkButton>
          )}
        </div>
      </div>
    </AppShell>
  );
}
