import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const testimonials = [
  {
    quote: "I stopped juggling six apps. The planner alone gave me back an hour every evening.",
    name: "Maya Chen",
    role: "Med student · UCLA",
  },
  {
    quote: "The exam readiness score is brutally honest. That's exactly why I trust it.",
    name: "Daniel Owusu",
    role: "Engineering · TU Berlin",
  },
  {
    quote: "It feels less like software and more like a calm tutor that actually pays attention.",
    name: "Priya Raman",
    role: "Law student · NLSIU",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="Loved by students"
          title={<>Built for the way <span className="gradient-text">you actually study</span>.</>}
        />
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass rounded-2xl p-6"
            >
              <Quote className="size-5 text-primary/70" />
              <blockquote className="mt-3 text-sm leading-relaxed">{t.quote}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="size-9 rounded-full gradient-primary" />
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
