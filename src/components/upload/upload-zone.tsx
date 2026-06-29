"use client";

import { useCallback, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, X, Loader2, CheckCircle2 } from "lucide-react";
import { useApp } from "@/state/app-store";
import { SparkButton } from "@/components/ui/spark-button";
import { validateFile, SUPPORTED_EXTS, MAX_FILE_BYTES } from "@/lib/file-extract";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function UploadZone({ redirectTo = "/notes" }: { redirectTo?: string }) {
  const { uploadAndProcess, documents } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFile = useCallback(
    async (file: File) => {
      const v = validateFile(file);
      if (!v.ok) {
        toast.error(v.message);
        return;
      }
      const result = await uploadAndProcess(file);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      setProcessingId(result.documentId);
      toast.success("Your study set is ready");
      setTimeout(() => navigate({ to: redirectTo }), 600);
    },
    [uploadAndProcess, navigate, redirectTo],
  );

  const active = processingId
    ? documents.find((d) => d.id === processingId)
    : documents.find((d) => d.status !== "ready" && d.status !== "failed");

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) void handleFile(f);
      }}
      className={cn(
        "glass-strong rounded-3xl p-8 md:p-10 text-center transition-all relative overflow-hidden",
        dragOver && "ring-2 ring-primary/60 scale-[1.005]",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={SUPPORTED_EXTS.join(",")}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto grid place-items-center size-16 rounded-2xl gradient-primary glow mb-4"
      >
        <UploadCloud className="size-7 text-primary-foreground" />
      </motion.div>

      <h3 className="font-display text-xl font-semibold">Drop a document to begin</h3>
      <p className="mt-1.5 text-sm text-muted-foreground max-w-md mx-auto">
        StudySpark turns your material into structured notes, adaptive flashcards and personalized quizzes — in seconds.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
        {SUPPORTED_EXTS.map((e) => (
          <span key={e} className="px-2 py-1 rounded-full glass-subtle uppercase tracking-wider">
            {e.replace(".", "")}
          </span>
        ))}
        <span className="px-2 py-1 rounded-full glass-subtle">
          ≤ {Math.round(MAX_FILE_BYTES / 1024 / 1024)} MB
        </span>
      </div>

      <div className="mt-6">
        <SparkButton
          leadingIcon={<UploadCloud className="size-4" />}
          onClick={() => inputRef.current?.click()}
        >
          Browse files
        </SparkButton>
      </div>

      <AnimatePresence>
        {active && active.status !== "ready" && active.status !== "failed" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 mx-auto max-w-md text-left glass rounded-2xl p-4"
          >
            <div className="flex items-center gap-3">
              <FileText className="size-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{active.title}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Loader2 className="size-3 animate-spin" />
                  {active.stageLabel ?? "Processing…"}
                </div>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{active.progress}%</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full gradient-primary"
                animate={{ width: `${active.progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </motion.div>
        )}
        {active && active.status === "ready" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 inline-flex items-center gap-2 text-sm text-success"
          >
            <CheckCircle2 className="size-4" /> Ready
          </motion.div>
        )}
        {active && active.status === "failed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 inline-flex items-center gap-2 text-sm text-destructive"
          >
            <X className="size-4" /> {active.errorMessage ?? "Failed"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
