"use client";

import { Bell, Search, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SparkButton } from "@/components/ui/spark-button";
import { useApp } from "@/state/app-store";

export function AppTopbar() {
  const { notifications, markAllRead } = useApp();
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <div className="glass rounded-2xl px-3 md:px-4 py-2.5 flex items-center gap-2 md:gap-3">
      <div className="flex-1 flex items-center gap-2 rounded-xl glass-subtle px-3 py-2">
        <Search className="size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search notes, flashcards, topics…"
          className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground"
        />
        <kbd className="hidden md:inline-flex items-center text-[10px] text-muted-foreground border border-white/10 rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </div>
      <Link to="/notes">
        <SparkButton size="sm" leadingIcon={<Plus className="size-4" />} className="hidden md:inline-flex">
          New upload
        </SparkButton>
      </Link>
      <button
        aria-label="Notifications"
        onClick={markAllRead}
        className="size-9 grid place-items-center rounded-full glass-subtle hover:bg-white/5 relative"
      >
        <Bell className="size-4" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-[10px] text-primary-foreground grid place-items-center">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
