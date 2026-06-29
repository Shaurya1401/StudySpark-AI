import { motion } from "framer-motion";
import { UploadCloud, FileText, Layers, Brain, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

export function UploadDemo() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="Live demonstration"
          title={<>From one PDF to a <span className="gradient-text">complete study toolkit</span>.</>}
          description="Watch a single upload become notes, flashcards, a quiz and a mentor briefing."
        />

        <div className="mt-12 grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[340px]"
          >
            <div className="relative">
              <div className="absolute inset-0 -z-10 blur-2xl bg-primary/30 rounded-full" />
              <div className="size-20 grid place-items-center rounded-3xl gradient-primary glow animate-float-slow">
                <UploadCloud className="size-9 text-primary-foreground" />
              </div>
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold">Drop your study material</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              PDFs, slides, lecture notes. We extract, structure and learn from every page.
            </p>
            <div className="mt-6 w-full max-w-sm glass-subtle rounded-2xl p-3">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-primary" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">Operating_Systems.pdf</div>
                  <div className="text-xs text-muted-foreground">142 pages · 4.2 MB</div>
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full gradient-primary"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: FileText, title: "AI Notes", lines: 5 },
              { icon: Layers, title: "Flashcards", lines: 4 },
              { icon: Brain, title: "Adaptive Quiz", lines: 4 },
              { icon: Sparkles, title: "Mentor Briefing", lines: 3 },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                className="glass rounded-2xl p-4"
              >
                <div className="flex items-center gap-2">
                  <c.icon className="size-4 text-primary" />
                  <span className="text-sm font-medium">{c.title}</span>
                </div>
                <div className="mt-3 space-y-1.5">
                  {Array.from({ length: c.lines }).map((_, j) => (
                    <div
                      key={j}
                      className="h-2 rounded-full animate-shimmer"
                      style={{ width: `${60 + ((i + j) * 17) % 35}%` }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
