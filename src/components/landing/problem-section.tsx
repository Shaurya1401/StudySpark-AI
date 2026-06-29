import { motion } from "framer-motion";
import { AlertTriangle, ShuffleIcon, Clock3, BatteryLow } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const pain = [
  { icon: ShuffleIcon, title: "Endless tab switching", desc: "PDFs, notes, chatbots, quizzes, calendars — each pulling attention in a different direction." },
  { icon: Clock3, title: "Plans that fall apart", desc: "Generic study plans that ignore exam dates, energy levels and actual progress." },
  { icon: AlertTriangle, title: "Unknown weak spots", desc: "You only discover what you don't know during the exam itself." },
  { icon: BatteryLow, title: "Cognitive overload", desc: "Tools designed for productivity, not learning. The work feels heavier than it should." },
];

export function ProblemSection() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="Why students burn out"
          title={<>Learning shouldn't feel <span className="gradient-text">chaotic</span>.</>}
          description="Modern studying is fragmented across a dozen tools. StudySpark unifies it into one calm workspace."
        />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pain.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="glass-subtle rounded-2xl p-5"
            >
              <p.icon className="size-5 text-warning" />
              <h3 className="mt-3 font-display text-base font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
