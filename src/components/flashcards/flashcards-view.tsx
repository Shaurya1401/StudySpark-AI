"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, RotateCcw, Sparkles, Filter, Search } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { useApp } from "@/state/app-store";
import { SparkButton } from "@/components/ui/spark-button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import type { Flashcard } from "@/types";

export function FlashcardsView() {
  const { flashcards, reviewFlashcard, toggleFlashcardBookmark, generateMoreFlashcards } = useApp();
  const [filter, setFilter] = useState<"all" | "due" | "bookmarked">("all");
  const [search, setSearch] = useState("");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const deck = useMemo(() => {
    let d = flashcards;
    if (filter === "due") d = d.filter((c) => new Date(c.nextReview) <= new Date());
    if (filter === "bookmarked") d = d.filter((c) => c.bookmarked);
    if (search) {
      const q = search.toLowerCase();
      d = d.filter((c) => c.question.toLowerCase().includes(q) || c.topic.toLowerCase().includes(q));
    }
    return d;
  }, [flashcards, filter, search]);

  const card: Flashcard | undefined = deck[idx % Math.max(1, deck.length)];

  const stats = useMemo(() => {
    const mastered = flashcards.filter((c) => c.confidence > 0.75).length;
    const due = flashcards.filter((c) => new Date(c.nextReview) <= new Date()).length;
    const avgConf = flashcards.length
      ? Math.round((flashcards.reduce((a, c) => a + c.confidence, 0) / flashcards.length) * 100)
      : 0;
    return { mastered, due, avgConf };
  }, [flashcards]);

  function grade(g: "again" | "hard" | "good" | "easy") {
    if (!card) return;
    reviewFlashcard(card.id, g);
    setFlipped(false);
    setIdx((i) => i + 1);
  }

  if (flashcards.length === 0) {
    return (
      <AppShell>
        <div className="glass-strong rounded-3xl p-10">
          <EmptyState
            icon={<Sparkles className="size-5 text-primary" />}
            title="Your flashcards will live here"
            description="Upload a document on the Notes page to generate adaptive flashcards."
            action={
              <SparkButton onClick={() => generateMoreFlashcards()}>
                Generate sample deck
              </SparkButton>
            }
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid grid-cols-12 gap-4">
        <section className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="In deck" value={flashcards.length} />
          <Stat label="Due now" value={stats.due} />
          <Stat label="Mastered" value={stats.mastered} />
          <Stat label="Avg confidence" value={`${stats.avgConf}%`} />
        </section>

        <section className="col-span-12 lg:col-span-8 glass rounded-3xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-display text-lg font-semibold">Review</h2>
            <div className="text-xs text-muted-foreground">
              {deck.length === 0 ? "No cards match filter" : `Card ${(idx % deck.length) + 1} of ${deck.length}`}
            </div>
          </div>

          <div className="mt-5 relative h-72 [perspective:1200px]">
            <AnimatePresence mode="wait">
              {card && (
                <motion.button
                  key={card.id + (flipped ? "-back" : "-front")}
                  initial={{ opacity: 0, rotateY: flipped ? -90 : 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: flipped ? 90 : -90 }}
                  transition={{ duration: 0.35 }}
                  onClick={() => setFlipped((f) => !f)}
                  className="absolute inset-0 glass-strong rounded-3xl p-8 text-left [transform-style:preserve-3d] hover:scale-[1.005] transition-transform"
                >
                  <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span>{card.topic} · {card.difficulty}</span>
                    <span>{flipped ? "Answer" : "Question"} — click to flip</span>
                  </div>
                  <div className="mt-6 font-display text-xl md:text-2xl leading-snug">
                    {flipped ? card.answer : card.question}
                  </div>
                  <div className="absolute bottom-5 left-8 right-8 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Confidence {Math.round(card.confidence * 100)}%</span>
                    <span>Reviewed {card.reviewCount}×</span>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {card && (
            <div className="mt-5">
              {flipped ? (
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { g: "again", label: "Again", tone: "bg-destructive/20 text-destructive" },
                      { g: "hard", label: "Hard", tone: "bg-warning/20 text-warning" },
                      { g: "good", label: "Good", tone: "bg-info/20 text-info" },
                      { g: "easy", label: "Easy", tone: "bg-success/20 text-success" },
                    ] as const
                  ).map((b) => (
                    <button
                      key={b.g}
                      onClick={() => grade(b.g)}
                      className={cn(
                        "rounded-2xl py-3 text-sm font-medium glass glass-hover",
                        b.tone,
                      )}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2">
                  <SparkButton variant="glass" onClick={() => setFlipped(true)}>
                    Reveal answer
                  </SparkButton>
                  <SparkButton variant="ghost" onClick={() => setIdx((i) => i + 1)} leadingIcon={<RotateCcw className="size-4" />}>
                    Skip
                  </SparkButton>
                  <button
                    onClick={() => toggleFlashcardBookmark(card.id)}
                    className="ml-auto inline-flex items-center gap-1.5 text-xs glass-subtle rounded-full px-3 py-1.5"
                  >
                    <Bookmark className={cn("size-3.5", card.bookmarked && "fill-primary text-primary")} />
                    Bookmark
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="col-span-12 lg:col-span-4 grid gap-4">
          <div className="glass rounded-3xl p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Filter className="size-3" /> Filter
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(["all", "due", "bookmarked"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setIdx(0); }}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full",
                    filter === f ? "gradient-primary text-primary-foreground" : "glass-subtle text-muted-foreground",
                  )}
                >
                  {f === "all" ? "All" : f === "due" ? "Due now" : "Bookmarked"}
                </button>
              ))}
            </div>
            <div className="mt-3 glass-subtle rounded-xl px-3 py-2 flex items-center gap-2">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setIdx(0); }}
                placeholder="Search cards…"
                className="bg-transparent w-full text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="glass rounded-3xl p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Deck preview</div>
            <ul className="mt-2 max-h-80 overflow-y-auto pr-1 space-y-1">
              {deck.slice(0, 30).map((c, i) => (
                <li
                  key={c.id}
                  className={cn(
                    "text-sm px-3 py-2 rounded-xl glass-subtle",
                    (idx % Math.max(1, deck.length)) === i && "ring-1 ring-primary/40",
                  )}
                >
                  <div className="truncate">{c.question}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {c.topic} · {Math.round(c.confidence * 100)}%
                  </div>
                </li>
              ))}
            </ul>
            <SparkButton size="sm" variant="ghost" className="mt-2" onClick={() => generateMoreFlashcards()}>
              + Generate more cards
            </SparkButton>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="font-display text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
