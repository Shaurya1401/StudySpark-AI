"use client";

import { useMemo, useState } from "react";
import {
  Bookmark,
  BookOpen,
  Download,
  FileText,
  Printer,
  RefreshCcw,
  Search,
  Share2,
} from "lucide-react";
import { AppShell } from "@/components/dashboard/app-shell";
import { UploadZone } from "@/components/upload/upload-zone";
import { useApp } from "@/state/app-store";
import { SparkButton } from "@/components/ui/spark-button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { NoteSection, AINotes } from "@/types";

const SECTION_LABELS: Record<NoteSection, string> = {
  summary: "Executive Summary",
  objectives: "Learning Objectives",
  concepts: "Key Concepts",
  definitions: "Definitions",
  formulae: "Formula Sheet",
  examples: "Worked Examples",
  code: "Code",
  checklist: "Revision Checklist",
  faq: "FAQ",
  onePage: "One-Page Sheet",
};

export function NotesView() {
  const { notes, bookmarkNote, regenerateNote } = useApp();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [section, setSection] = useState<NoteSection>("summary");

  const filtered = useMemo(
    () =>
      notes.filter((n) =>
        search ? n.title.toLowerCase().includes(search.toLowerCase()) : true,
      ),
    [notes, search],
  );

  const active: AINotes | null =
    filtered.find((n) => n.id === activeId) ?? filtered[0] ?? null;

  if (notes.length === 0) {
    return (
      <AppShell>
        <UploadZone />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-3 glass rounded-3xl p-3 lg:sticky lg:top-4 lg:h-[calc(100dvh-2rem)] flex flex-col">
          <div className="px-2 py-2 flex items-center gap-2 text-sm font-medium">
            <BookOpen className="size-4 text-primary" />
            AI Notes
          </div>
          <div className="px-2 mb-2">
            <div className="glass-subtle rounded-xl px-3 py-2 flex items-center gap-2">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto pr-1 space-y-1">
            {filtered.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => setActiveId(n.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-start gap-2",
                    active?.id === n.id
                      ? "bg-white/8 glass-subtle text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  )}
                >
                  <FileText className="size-4 mt-0.5 text-primary shrink-0" />
                  <span className="flex-1 truncate">{n.title}</span>
                  {n.bookmarked && <Bookmark className="size-3 text-primary fill-primary" />}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2">
            <UploadZoneCompact />
          </div>
        </aside>

        {/* Reader */}
        <section className="col-span-12 lg:col-span-9 glass rounded-3xl p-6 md:p-8">
          {active && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Study set · v{active.version}</div>
                  <h1 className="font-display text-2xl md:text-3xl font-semibold">{active.title}</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                  <SparkButton
                    size="sm"
                    variant="glass"
                    leadingIcon={<Bookmark className="size-4" />}
                    onClick={() => bookmarkNote(active.id, !active.bookmarked)}
                  >
                    {active.bookmarked ? "Bookmarked" : "Bookmark"}
                  </SparkButton>
                  <SparkButton
                    size="sm"
                    variant="glass"
                    leadingIcon={<RefreshCcw className="size-4" />}
                    onClick={async () => {
                      toast.promise(regenerateNote(active.id), {
                        loading: "Regenerating…",
                        success: "Notes refreshed",
                        error: "Couldn't regenerate",
                      });
                    }}
                  >
                    Regenerate
                  </SparkButton>
                  <SparkButton
                    size="sm"
                    variant="ghost"
                    leadingIcon={<Download className="size-4" />}
                    onClick={() => exportNote(active)}
                  >
                    Export
                  </SparkButton>
                  <SparkButton
                    size="sm"
                    variant="ghost"
                    leadingIcon={<Printer className="size-4" />}
                    onClick={() => typeof window !== "undefined" && window.print()}
                  >
                    Print
                  </SparkButton>
                  <SparkButton
                    size="sm"
                    variant="ghost"
                    leadingIcon={<Share2 className="size-4" />}
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      toast.success("Link copied");
                    }}
                  >
                    Share
                  </SparkButton>
                </div>
              </div>

              <div className="mt-5 flex gap-1.5 overflow-x-auto pb-2">
                {(Object.keys(SECTION_LABELS) as NoteSection[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setSection(k)}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-full transition-colors whitespace-nowrap",
                      section === k
                        ? "gradient-primary text-primary-foreground"
                        : "glass-subtle text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {SECTION_LABELS[k]}
                  </button>
                ))}
              </div>

              <article className="prose-invert mt-6 leading-relaxed text-[15px] whitespace-pre-wrap">
                {active.sections[section]}
              </article>
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function exportNote(n: AINotes) {
  const md = [
    `# ${n.title}`,
    "",
    ...(Object.keys(SECTION_LABELS) as NoteSection[]).flatMap((k) => [
      `## ${SECTION_LABELS[k]}`,
      "",
      n.sections[k],
      "",
    ]),
  ].join("\n");
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${n.title}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function UploadZoneCompact() {
  // Reuse the full UploadZone as compact card. Keeping the sidebar action visible.
  return (
    <div className="glass-subtle rounded-2xl p-3 text-xs text-muted-foreground text-center">
      Drop another document anywhere to add it.
    </div>
  );
}
