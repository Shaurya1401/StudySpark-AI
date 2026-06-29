import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, PlayCircle } from "lucide-react";
import { SparkButton } from "@/components/ui/spark-button";
import { STATS } from "@/constants/site";
import { DashboardPreview } from "./dashboard-preview";

export function Hero() {
  return (
    <section id="home" className="relative pt-32 md:pt-40 pb-16 md:pb-24">
      <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full glass-subtle px-3 py-1 text-xs text-muted-foreground"
          >
            <span className="size-1.5 rounded-full bg-primary animate-pulse-glow" />
            Your intelligent learning workspace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-5 font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95] text-balance"
          >
            One Upload.
            <br />
            <span className="gradient-text">Infinite Learning.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground"
          >
            Drop any document and StudySpark instantly creates AI notes,
            flashcards, adaptive quizzes, a smart planner, exam readiness, and a
            personal mentor — all in one calm workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/dashboard">
              <SparkButton size="lg" trailingIcon={<ArrowRight className="size-4" />}>
                Start Learning Free
              </SparkButton>
            </Link>
            <SparkButton variant="glass" size="lg" leadingIcon={<PlayCircle className="size-4" />}>
              Watch Interactive Demo
            </SparkButton>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {STATS.map((s) => (
              <div key={s.label} className="glass-subtle rounded-xl px-3 py-3">
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
                <dd className="font-display text-lg font-semibold">{s.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="lg:col-span-6">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
