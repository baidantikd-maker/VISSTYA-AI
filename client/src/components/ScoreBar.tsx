import { scoreToBand } from "@/lib/status";
import { cn } from "@/lib/utils";

export function ScoreBar({
  label,
  score,
  max,
  className,
}: {
  label: string;
  score: number;
  max: number;
  className?: string;
}) {
  const pct = Math.round((score / max) * 100);
  const meta = scoreToBand((score / max) * 100);
  const barColor =
    meta === "FALSE"
      ? "bg-false"
      : meta === "AVERAGE"
        ? "bg-average"
        : "bg-trustable";

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm text-[hsl(var(--foreground))]">{label}</span>
        <span className="text-sm tabular-nums text-[hsl(var(--muted))]">
          {score}
          <span className="text-[hsl(var(--muted))]/70"> / {max}</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--secondary))]">
        <div
          className={cn("h-full rounded-full", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
