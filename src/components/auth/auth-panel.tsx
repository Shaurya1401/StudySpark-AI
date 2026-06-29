"use client";

import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, Mail, Lock, User as UserIcon, Github } from "lucide-react";
import { motion } from "framer-motion";
import { SparkButton } from "@/components/ui/spark-button";
import { SITE } from "@/constants/site";
import { useApp } from "@/state/app-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4); // 0..4
}

const strengthLabels = ["Too weak", "Weak", "Okay", "Strong", "Excellent"];
const strengthColor = ["bg-destructive", "bg-warning", "bg-warning", "bg-primary", "bg-success"];

export function AuthPanel({ initialMode = "signin" }: { initialMode?: "signin" | "signup" }) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithProvider, profile } = useApp();
  const navigate = useNavigate();

  const strength = passwordStrength(password);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    if (mode === "signup" && strength < 3) {
      toast.error("Please choose a stronger password.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(name || email.split("@")[0]!, email, password);
        navigate({ to: "/onboarding" });
      } else {
        await signIn(email, password);
        navigate({ to: profile ? "/dashboard" : "/onboarding" });
      }
    } finally {
      setLoading(false);
    }
  }

  async function oauth(provider: "google" | "github") {
    setLoading(true);
    try {
      await signInWithProvider(provider);
      navigate({ to: profile ? "/dashboard" : "/onboarding" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh grid lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden lg:flex items-center justify-center p-10 overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-80">
          <div className="absolute -top-20 -left-20 size-[480px] rounded-full blur-3xl gradient-primary opacity-30" />
          <div className="absolute bottom-0 right-0 size-[420px] rounded-full blur-3xl gradient-accent opacity-30" />
        </div>
        <div className="max-w-md">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="grid place-items-center size-9 rounded-xl gradient-primary glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </span>
            <span className="font-display font-semibold text-lg">{SITE.name}</span>
          </Link>
          <h1 className="mt-10 font-display text-4xl font-semibold leading-tight">
            Your <span className="gradient-text">intelligent</span> learning workspace.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Upload a document. Get notes, flashcards, an adaptive quiz, and a personal AI mentor —
            all in one place.
          </p>

          <div className="mt-8 grid gap-3">
            {[
              "Personalized to your weak topics",
              "Spaced-repetition that adapts to confidence",
              "An AI mentor that remembers your journey",
            ].map((t) => (
              <div key={t} className="glass rounded-2xl px-4 py-3 text-sm">
                ✦ {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="grid place-items-center p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-strong rounded-3xl p-7 md:p-9 w-full max-w-md"
        >
          <Link to="/" className="lg:hidden inline-flex items-center gap-2">
            <span className="grid place-items-center size-8 rounded-xl gradient-primary glow">
              <Sparkles className="size-4 text-primary-foreground" />
            </span>
            <span className="font-display font-semibold">{SITE.name}</span>
          </Link>

          <div className="mt-4 lg:mt-0 flex gap-2 glass-subtle rounded-full p-1 w-fit">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm transition-colors",
                  mode === m ? "bg-white/10 text-foreground" : "text-muted-foreground",
                )}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <h2 className="mt-5 font-display text-2xl font-semibold">
            {mode === "signin" ? "Welcome back" : "Start learning smarter"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to continue your learning journey."
              : "It takes less than a minute — no credit card required."}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              onClick={() => oauth("google")}
              disabled={loading}
              className="glass glass-hover rounded-xl px-3 py-2.5 text-sm inline-flex items-center justify-center gap-2"
            >
              <GoogleGlyph /> Google
            </button>
            <button
              onClick={() => oauth("github")}
              disabled={loading}
              className="glass glass-hover rounded-xl px-3 py-2.5 text-sm inline-flex items-center justify-center gap-2"
            >
              <Github className="size-4" /> GitHub
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex-1 h-px bg-white/10" /> or with email
            <span className="flex-1 h-px bg-white/10" />
          </div>

          <form className="space-y-3" onSubmit={submit}>
            {mode === "signup" && (
              <Field icon={<UserIcon className="size-4" />} label="Name">
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="auth-input"
                />
              </Field>
            )}
            <Field icon={<Mail className="size-4" />} label="Email">
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studyspark.ai"
                className="auth-input"
                required
              />
            </Field>
            <Field icon={<Lock className="size-4" />} label="Password">
              <input
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="auth-input"
                required
                minLength={mode === "signup" ? 8 : undefined}
              />
            </Field>

            {mode === "signup" && password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full",
                        i < strength ? strengthColor[strength] : "bg-white/8",
                      )}
                    />
                  ))}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {strengthLabels[strength]} — needs 8+ chars, upper, lower, number.
                </div>
              </div>
            )}

            {mode === "signin" && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-muted-foreground hover:text-foreground">
                  Forgot password?
                </button>
              </div>
            )}

            <SparkButton type="submit" loading={loading} className="w-full mt-2">
              {mode === "signin" ? "Sign in" : "Create account"}
            </SparkButton>
          </form>

          <p className="mt-5 text-xs text-center text-muted-foreground">
            By continuing you agree to our Terms & Privacy. Sessions persist locally — connect
            Lovable Cloud to enable real Supabase auth.
          </p>
        </motion.div>
      </div>

      <style>{`
        .auth-input {
          width: 100%; background: transparent; outline: none;
          color: var(--color-foreground); font-size: 14px;
        }
        .auth-input::placeholder { color: var(--color-muted-foreground); }
      `}</style>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="mt-1 flex items-center gap-2 glass-subtle rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-ring">
        <span className="text-muted-foreground">{icon}</span>
        {children}
      </span>
    </label>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.5-1.7 4.3-5.5 4.3-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.6 14.7 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 11.9S6.9 21 12 21c6.9 0 9.2-4.9 9.2-7.4 0-.5 0-.9-.1-1.3H12z"
      />
    </svg>
  );
}
