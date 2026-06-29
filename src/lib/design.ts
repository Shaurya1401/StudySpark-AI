// Centralized design helpers — keep classes consistent across the app.

export const glass = {
  base: "glass rounded-2xl",
  strong: "glass-strong rounded-2xl",
  subtle: "glass-subtle rounded-xl",
  hover: "glass glass-hover rounded-2xl",
} as const;

export const text = {
  display: "font-display tracking-tight",
  gradient: "gradient-text",
  muted: "text-muted-foreground",
} as const;
