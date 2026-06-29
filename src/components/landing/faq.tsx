import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const faqs = [
  { q: "What kind of files can I upload?", a: "PDFs, slides, lecture notes, and text. The AI extracts and structures the content into your workspace." },
  { q: "Is my data private?", a: "Yes. Your documents are encrypted at rest and never used to train external models." },
  { q: "Does it work offline?", a: "You can review notes and flashcards offline. AI generation requires a connection." },
  { q: "How is this different from a chatbot?", a: "StudySpark is a workspace. Notes, flashcards, planner, quizzes and analytics all adapt together — the chat is just one surface." },
  { q: "Can I cancel any time?", a: "Yes. Plans are monthly and can be cancelled in a single click. You keep your generated material." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="FAQ"
          title={<>Answers, <span className="gradient-text">honestly</span>.</>}
        />

        <div className="mt-12 max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="glass rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium">{f.q}</span>
                  <span className="size-7 grid place-items-center rounded-full glass-subtle">
                    {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {f.a}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
