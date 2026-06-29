import { cn } from "@/lib/utils";

export function Ring({
  value,
  size = 120,
  stroke = 10,
  label,
  sub,
  className,
}: {
  value: number; // 0..100
  size?: number;
  stroke?: number;
  label?: string;
  sub?: string;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.7 0.18 270)" />
            <stop offset="100%" stopColor="oklch(0.78 0.18 220)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(1 0 0 / 0.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ring-grad)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          style={{ transition: "stroke-dasharray 800ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold font-display">{Math.round(value)}%</div>
        {label ? <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div> : null}
        {sub ? <div className="text-[10px] text-muted-foreground/80">{sub}</div> : null}
      </div>
    </div>
  );
}
