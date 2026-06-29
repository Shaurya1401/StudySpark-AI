import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/ui/section-heading";
import { SparkButton } from "@/components/ui/spark-button";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    features: ["3 documents", "AI Notes & Summaries", "Basic flashcards", "Daily planner"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Scholar",
    price: "$9",
    period: "/ month",
    features: ["Unlimited documents", "Adaptive quizzes", "Exam readiness score", "AI Mentor chat", "Analytics dashboard"],
    cta: "Go Scholar",
    featured: true,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    features: ["Everything in Scholar", "Priority AI processing", "Group study spaces", "Export to PDF / Anki", "Early access features"],
    cta: "Choose Pro",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="Pricing"
          title={<>Simple plans for <span className="gradient-text">serious learners</span>.</>}
          description="Start free. Upgrade when StudySpark becomes part of your daily routine."
        />

        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={cn(
                "glass rounded-3xl p-6 flex flex-col",
                t.featured && "glass-strong glow border-primary/30",
              )}
            >
              {t.featured ? (
                <div className="self-start text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full gradient-primary text-primary-foreground font-semibold">
                  Most popular
                </div>
              ) : null}
              <div className="mt-3 font-display text-lg font-semibold">{t.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <div className="font-display text-4xl font-semibold">{t.price}</div>
                <div className="text-sm text-muted-foreground">{t.period}</div>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="size-4 text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/dashboard" className="mt-6">
                <SparkButton
                  variant={t.featured ? "primary" : "glass"}
                  className="w-full"
                >
                  {t.cta}
                </SparkButton>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
