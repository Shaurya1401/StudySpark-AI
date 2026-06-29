"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Send, Sparkles, MessageSquare } from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { useApp } from "@/state/app-store";
import { SparkButton } from "@/components/ui/spark-button";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What should I revise today?",
  "Explain Binary Search like I'm new to it.",
  "Am I ready for my next exam?",
  "Build me a 30-minute focused session.",
];

export function MentorView() {
  const { conversations, createConversation, sendMentorMessage } = useApp();
  const [activeId, setActiveId] = useState<string | null>(conversations[0]?.id ?? null);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  useEffect(() => {
    if (!active && conversations.length === 0) {
      const c = createConversation("How can I help?");
      setActiveId(c.id);
    }
  }, [active, conversations.length, createConversation]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, active?.messages.at(-1)?.content]);

  async function send(text: string) {
    if (!active || !text.trim() || streaming) return;
    setInput("");
    setStreaming(true);
    try {
      await sendMentorMessage(active.id, text.trim());
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  }

  return (
    <AppShell>
      <div className="grid grid-cols-12 gap-4 h-[calc(100dvh-7rem)]">
        <aside className="col-span-12 lg:col-span-3 glass rounded-3xl p-3 flex flex-col">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="inline-flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="size-4 text-primary" /> Conversations
            </div>
            <button
              onClick={() => {
                const c = createConversation();
                setActiveId(c.id);
              }}
              className="size-7 grid place-items-center rounded-full glass-subtle hover:bg-white/10"
              aria-label="New conversation"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto pr-1 space-y-1">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActiveId(c.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-xl text-sm",
                    active?.id === c.id
                      ? "bg-white/8 glass-subtle"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  )}
                >
                  <div className="truncate">{c.title || "Untitled"}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {c.messages.length} message{c.messages.length === 1 ? "" : "s"}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="col-span-12 lg:col-span-9 glass rounded-3xl flex flex-col overflow-hidden">
          <header className="px-6 py-4 border-b border-white/5 flex items-center gap-2">
            <span className="grid place-items-center size-8 rounded-xl gradient-primary glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </span>
            <div>
              <div className="font-display font-semibold">AI Mentor</div>
              <div className="text-xs text-muted-foreground">
                Calm, focused, contextual — built on your notes and progress.
              </div>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
            {(!active || active.messages.length === 0) && (
              <div className="max-w-xl mx-auto text-center pt-8">
                <div className="mx-auto grid place-items-center size-14 rounded-2xl gradient-primary glow">
                  <Sparkles className="size-6 text-primary-foreground" />
                </div>
                <h2 className="mt-4 font-display text-xl">How can I help tonight?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask anything about your material, or pick a suggestion to begin.
                </p>
                <div className="mt-5 grid sm:grid-cols-2 gap-2 text-left">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="glass glass-hover rounded-2xl px-4 py-3 text-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {active?.messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
                  m.role === "user"
                    ? "ml-auto gradient-primary text-primary-foreground"
                    : "glass-subtle",
                )}
              >
                {m.content || (
                  <span className="inline-flex gap-1">
                    <Dot /> <Dot delay={0.15} /> <Dot delay={0.3} />
                  </span>
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-white/5 p-3"
          >
            <div className="glass-subtle rounded-2xl p-2 flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask your AI mentor anything…"
                rows={1}
                className="flex-1 bg-transparent outline-none px-3 py-2 text-sm resize-none max-h-40 placeholder:text-muted-foreground"
              />
              <SparkButton
                type="submit"
                size="sm"
                loading={streaming}
                disabled={!input.trim()}
                leadingIcon={!streaming ? <Send className="size-4" /> : undefined}
              >
                Send
              </SparkButton>
            </div>
            <div className="mt-1 px-2 text-[11px] text-muted-foreground">
              Mentor uses your notes, quizzes and goals as context. Press Enter to send.
            </div>
          </form>
        </section>
      </div>
    </AppShell>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return (
    <span
      className="inline-block size-1.5 rounded-full bg-current opacity-60"
      style={{
        animation: `pulse-glow 1.4s ${delay}s ease-in-out infinite`,
      }}
    />
  );
}
