import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Layers,
  Brain,
  CalendarRange,
  Target,
  Sparkles,
  LineChart,
  Bookmark,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const features = [
  { icon: Upload, title: "Smart Upload", desc: "Drop a PDF and your entire study workflow updates around it." },
  { icon: FileText, title: "AI Notes", desc: "Structured summaries, definitions, formulae, examples and one-page revision." },
  { icon: Layers, title: "Adaptive Flashcards", desc: "Spaced repetition tuned to your confidence on every concept." },
  { icon: Brain, title: "Adaptive Quizzes", desc: "Quizzes that get harder where you're strong and softer where you struggle." },
  { icon: CalendarRange, title: "Smart Planner", desc: "Plans rebuild themselves around your calendar and exam date." },
  { icon: Target, title: "Exam Readiness", desc: "A live readiness score with the topics keeping you from 100%." },
  { icon: Sparkles, title: "AI Mentor", desc: "A calm academic companion that explains, motivates and recommends next steps." },
  { icon: LineChart, title: "Deep Analytics", desc: "Understand how you actually learn — by topic, time of day, and session." },
  { icon: Bookmark, title: "Unified Workspace", desc: "No more tab-switching. Your full study toolkit lives in one place." },
];

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="Everything in one place"
          title={<>A complete learning system, <span className="gradient-text">quietly intelligent</span>.</>}
          description="Each module strengthens the next. The platform learns your habits and adapts every recommendation."
        />

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="glass glass-hover rounded-2xl p-5"
            >
              <div className="size-10 grid place-items-center rounded-xl glass-subtle">
                <f.icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
