import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlassLevel = "subtle" | "base" | "strong";

export interface GlassProps extends HTMLAttributes<HTMLDivElement> {
  level?: GlassLevel;
  hover?: boolean;
  glow?: boolean;
}

const levelClass: Record<GlassLevel, string> = {
  subtle: "glass-subtle",
  base: "glass",
  strong: "glass-strong",
};

export const Glass = forwardRef<HTMLDivElement, GlassProps>(function Glass(
  { level = "base", hover, glow, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl",
        levelClass[level],
        hover && "glass-hover",
        glow && "glow",
        className,
      )}
      {...rest}
    />
  );
});
