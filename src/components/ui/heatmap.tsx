import { cn } from "@/lib/utils";

// 7 x 14 deterministic heatmap (mock until real data wires up).
export function Heatmap({ className }: { className?: string }) {
  const cells = Array.from({ length: 7 * 14 }).map((_, i) => {
    // pseudo-random but deterministic
    const v = Math.abs(Math.sin(i * 1.7)) ;
    return v;
  });
  const color = (v: number) => {
    if (v < 0.2) return "oklch(1 0 0 / 0.05)";
    if (v < 0.4) return "oklch(0.7 0.18 270 / 0.2)";
    if (v < 0.6) return "oklch(0.7 0.18 270 / 0.4)";
    if (v < 0.8) return "oklch(0.7 0.18 270 / 0.65)";
    return "oklch(0.78 0.18 220 / 0.9)";
  };
  return (
    <div className={cn("grid grid-flow-col grid-rows-7 gap-1", className)}>
      {cells.map((v, i) => (
        <div
          key={i}
          className="size-3 rounded-[3px] transition-all"
          style={{ background: color(v) }}
          aria-hidden
        />
      ))}
    </div>
  );
}
