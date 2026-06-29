import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "glass" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

export interface SparkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
}

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const variantClass: Record<Variant, string> = {
  primary:
    "text-primary-foreground gradient-primary shadow-[0_8px_30px_-8px_oklch(0.7_0.18_270/0.5)] hover:brightness-110",
  glass:
    "glass glass-hover text-foreground",
  ghost: "text-foreground/80 hover:text-foreground hover:bg-white/5",
  outline:
    "border border-white/15 text-foreground hover:bg-white/5",
};

export const SparkButton = forwardRef<HTMLButtonElement, SparkButtonProps>(
  function SparkButton(
    { variant = "primary", size = "md", leadingIcon, trailingIcon, loading, className, children, disabled, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium",
          "transition-all duration-300 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-[0.98]",
          sizeClass[size],
          variantClass[variant],
          className,
        )}
        {...rest}
      >
        {loading ? (
          <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          leadingIcon
        )}
        {children}
        {trailingIcon}
      </button>
    );
  },
);
