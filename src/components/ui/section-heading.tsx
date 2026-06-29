import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <div className="inline-flex items-center gap-2 rounded-full glass-subtle px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary animate-pulse-glow" />
          {eyebrow}
        </div>
      ) : null}
      <h2 className="mt-4 font-display text-3xl md:text-5xl font-semibold tracking-tight text-balance">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base md:text-lg text-muted-foreground text-balance">
          {description}
        </p>
      ) : null}
    </div>
  );
}
