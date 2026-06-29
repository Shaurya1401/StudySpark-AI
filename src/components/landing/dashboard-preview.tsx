import { motion } from "framer-motion";
import { Sparkles, Flame, Clock3, BookOpenCheck, Brain, Zap } from "lucide-react";
import { Ring } from "@/components/ui/ring";
import { Heatmap } from "@/components/ui/heatmap";

// Animated, decorative dashboard preview used in the hero.
export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
      aria-hidden
    >
      {/* Aurora behind preview */}
      <div className="absolute -inset-10 -z-10 opacity-70 blur-3xl">
        <div className="absolute top-0 left-1/4 size-72 rounded-full bg-primary/30" />
        <div className="absolute bottom-0 right-1/4 size-72 rounded-full bg-accent/30" />
      </div>

      <div className="glass-strong rounded-3xl p-4 md:p-5 noise">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </div>
          <div className="font-mono">studyspark.ai/dashboard</div>
          <div className="flex items-center gap-1.5">
            <Flame className="size-3.5 text-warning" />
            <span>12 day streak</span>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-3 md:gap-4">
          {/* Greeting */}
          <div className="col-span-6 md:col-span-4 glass rounded-2xl p-4">
            <div className="text-xs text-muted-foreground">Good evening</div>
            <div className="font-display text-xl font-semibold">Welcome back, Alex</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Algorithms", "Probability", "Linear Algebra"].map((t) => (
                <span key={t} className="text-[11px] px-2.5 py-1 rounded-full glass-subtle">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Readiness */}
          <div className="col-span-6 md:col-span-2 glass rounded-2xl p-4 flex flex-col items-center justify-center">
            <Ring value={72} size={100} stroke={8} label="Readiness" />
          </div>

          {/* AI Mentor */}
          <div className="col-span-6 md:col-span-3 glass rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" /> AI Mentor
            </div>
            <p className="mt-2 text-sm leading-relaxed">
              <TypewriterText
                text="Focus 25 minutes on Graph Theory tonight — recall dropped 8% this week."
              />
            </p>
          </div>

          {/* Heatmap */}
          <div className="col-span-6 md:col-span-3 glass rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Activity</span>
              <span className="font-mono">14 days</span>
            </div>
            <Heatmap className="mt-3" />
          </div>

          {/* Mini stats */}
          {[
            { icon: BookOpenCheck, label: "Notes", value: "42" },
            { icon: Brain, label: "Quizzes", value: "18" },
            { icon: Clock3, label: "Focus", value: "9.2h" },
            { icon: Zap, label: "XP", value: "1,840" },
          ].map((s) => (
            <div key={s.label} className="col-span-3 md:col-span-1.5 glass-subtle rounded-2xl p-3" style={{ gridColumn: "span 3" }}>
              <s.icon className="size-4 text-primary" />
              <div className="mt-1 font-display text-lg font-semibold">{s.value}</div>
              <div className="text-[11px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TypewriterText({ text }: { text: string }) {
  return (
    <span className="inline-block">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.015, duration: 0.2 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}
