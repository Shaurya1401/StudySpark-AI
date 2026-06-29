export const SITE = {
  name: "StudySpark AI",
  tagline: "One Upload. Infinite Learning.",
  description:
    "An intelligent learning workspace that turns any document into notes, flashcards, quizzes, and a personalized study plan.",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "Features", href: "/#features" },
  { label: "AI Mentor", href: "/#mentor" },
  { label: "Dashboard", href: "/#dashboard" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
] as const;

export const STATS = [
  { value: "50K+", label: "Study Sessions" },
  { value: "120K+", label: "AI Notes Generated" },
  { value: "97%", label: "Student Satisfaction" },
  { value: "2M+", label: "Flashcards Reviewed" },
] as const;
