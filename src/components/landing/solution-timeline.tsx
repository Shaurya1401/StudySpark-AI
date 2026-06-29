import { motion } from "framer-motion";
import { Upload, FileText, Layers, Brain, CalendarRange, Target } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  { icon: Upload, title: "Upload material", desc: "Drop a PDF, slides, or notes." },
  { icon: FileText, title: "AI generates notes", desc: "Summaries, definitions, examples." },
  { icon: Layers, title: "Flashcards appear", desc: "Adaptive spaced repetition." },
  { icon: Brain, title: "Adaptive quiz", desc: "Practice tuned to your weak topics." },
  { icon: CalendarRange, title: "Planner updates", desc: "A study plan built around you." },
  { icon: Target, title: "Readiness rises", desc: "Track exam readiness in real time." },
];

export function SolutionTimeline() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="One adaptive cycle"
          title={<>One upload powers <span className="gradient-text">your entire learning loop</span>.</>}
          description="Every action improves the next recommendation. The system gets smarter as you study."
        />

        <div className="mt-14 relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent hidden md:block" />
          <ol className="grid md:grid-cols-6 gap-4">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass rounded-2xl p-4 text-center"
              >
                <div className="mx-auto size-10 grid place-items-center rounded-xl gradient-primary text-primary-foreground">
                  <s.icon className="size-5" />
                </div>
                <div className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Step {i + 1}</div>
                <h3 className="mt-1 font-display font-semibold">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
