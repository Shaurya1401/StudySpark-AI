"use client";

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { SparkButton } from "@/components/ui/spark-button";
import { useApp } from "@/state/app-store";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/utils";

const COURSES = ["Engineering", "Computer Science", "Medicine", "Law", "Business", "Arts", "Other"];
const STYLES: Array<{ id: "visual" | "reading" | "auditory" | "kinesthetic" | "mixed"; label: string; desc: string }> = [
  { id: "visual", label: "Visual", desc: "Diagrams, mind maps, colour" },
  { id: "reading", label: "Reading", desc: "Long-form notes & summaries" },
  { id: "auditory", label: "Auditory", desc: "Explanations read aloud" },
  { id: "kinesthetic", label: "Hands-on", desc: "Worked problems & code" },
  { id: "mixed", label: "Mixed", desc: "A bit of everything" },
];
const GOALS = ["Ace upcoming exams", "Build long-term mastery", "Stay consistent daily", "Prepare for interviews"];

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { completeOnboarding, user } = useApp();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    course: "Computer Science",
    semester: "3",
    subjects: ["Algorithms", "Probability"],
    examDate: undefined as string | undefined,
    dailyStudyMinutes: 90,
    goals: ["Ace upcoming exams"] as string[],
    learningStyle: "mixed" as "visual" | "reading" | "auditory" | "kinesthetic" | "mixed",
  });

  const steps = [
    "Your course",
    "Subjects & exam",
    "Study cadence",
    "How you learn",
    "Goals",
  ];

  function next() {
    if (step < steps.length - 1) setStep(step + 1);
    else {
      completeOnboarding(data);
      navigate({ to: "/dashboard" });
    }
  }
  function prev() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <motion.div
        layout
        className="glass-strong rounded-3xl p-7 md:p-10 w-full max-w-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <span className="grid place-items-center size-8 rounded-xl gradient-primary glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </span>
            <span className="font-display font-semibold">{SITE.name}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Step {step + 1} of {steps.length}
          </div>
        </div>

        <div className="mt-6 flex gap-1.5">
          {steps.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= step ? "gradient-primary" : "bg-white/8",
              )}
            />
          ))}
        </div>

        <h1 className="mt-6 font-display text-2xl font-semibold">
          {step === 0 && `Hi ${user?.name?.split(" ")[0] ?? "there"} — what are you studying?`}
          {step === 1 && "Tell us about your subjects"}
          {step === 2 && "How much time can you give each day?"}
          {step === 3 && "How do you learn best?"}
          {step === 4 && "What are you aiming for?"}
        </h1>

        <div className="mt-6 min-h-[260px]">
          {step === 0 && (
            <div className="grid sm:grid-cols-2 gap-2">
              {COURSES.map((c) => (
                <button
                  key={c}
                  onClick={() => setData({ ...data, course: c })}
                  className={cn(
                    "glass glass-hover rounded-2xl px-4 py-3 text-left text-sm",
                    data.course === c && "ring-2 ring-primary/60",
                  )}
                >
                  {c}
                </button>
              ))}
              <input
                placeholder="Semester (e.g. 3)"
                value={data.semester}
                onChange={(e) => setData({ ...data, semester: e.target.value })}
                className="glass-subtle rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring sm:col-span-2"
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <TagInput
                label="Subjects"
                values={data.subjects}
                onChange={(subjects) => setData({ ...data, subjects })}
              />
              <label className="block">
                <span className="text-xs text-muted-foreground">Next exam date (optional)</span>
                <input
                  type="date"
                  value={data.examDate ?? ""}
                  onChange={(e) =>
                    setData({ ...data, examDate: e.target.value || undefined })
                  }
                  className="mt-1 w-full glass-subtle rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center font-display text-4xl font-semibold">
                {Math.round(data.dailyStudyMinutes / 60 * 10) / 10}h<span className="text-muted-foreground text-xl"> / day</span>
              </div>
              <input
                type="range"
                min={15}
                max={300}
                step={15}
                value={data.dailyStudyMinutes}
                onChange={(e) =>
                  setData({ ...data, dailyStudyMinutes: Number(e.target.value) })
                }
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>15 min</span><span>5 hours</span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid sm:grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setData({ ...data, learningStyle: s.id })}
                  className={cn(
                    "glass glass-hover rounded-2xl px-4 py-3 text-left",
                    data.learningStyle === s.id && "ring-2 ring-primary/60",
                  )}
                >
                  <div className="font-medium text-sm">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="grid sm:grid-cols-2 gap-2">
              {GOALS.map((g) => {
                const on = data.goals.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() =>
                      setData({
                        ...data,
                        goals: on ? data.goals.filter((x) => x !== g) : [...data.goals, g],
                      })
                    }
                    className={cn(
                      "glass glass-hover rounded-2xl px-4 py-3 text-left text-sm flex items-center gap-2",
                      on && "ring-2 ring-primary/60",
                    )}
                  >
                    <span
                      className={cn(
                        "size-5 rounded-md grid place-items-center",
                        on ? "gradient-primary" : "glass-subtle",
                      )}
                    >
                      {on && <Check className="size-3 text-primary-foreground" />}
                    </span>
                    {g}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between">
          <SparkButton
            variant="ghost"
            onClick={prev}
            disabled={step === 0}
            leadingIcon={<ArrowLeft className="size-4" />}
          >
            Back
          </SparkButton>
          <SparkButton onClick={next} trailingIcon={<ArrowRight className="size-4" />}>
            {step === steps.length - 1 ? "Enter dashboard" : "Continue"}
          </SparkButton>
        </div>
      </motion.div>
    </div>
  );
}

function TagInput({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const [v, setV] = useState("");
  return (
    <div>
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1 glass-subtle rounded-xl px-2 py-2 flex flex-wrap gap-1.5">
        {values.map((tag) => (
          <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/10 inline-flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== tag))}
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && v.trim()) {
              e.preventDefault();
              if (!values.includes(v.trim())) onChange([...values, v.trim()]);
              setV("");
            }
          }}
          placeholder="Add a subject and press Enter"
          className="bg-transparent flex-1 min-w-[160px] text-sm outline-none px-2 py-1 placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
