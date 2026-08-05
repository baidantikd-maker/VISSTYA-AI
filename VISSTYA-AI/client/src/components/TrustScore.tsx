import { STATUS_META, scoreToBand } from "@/lib/status";
import { clamp } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function useCountUp(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = clamp((now - start) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

export function TrustScore({
  score,
  className,
  animated = true,
  size = "lg",
}: {
  score: number;
  className?: string;
  animated?: boolean;
  size?: "md" | "lg";
}) {
  const display = animated ? useCountUp(score) : score;
  const meta = STATUS_META[scoreToBand(score)];

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-medium tabular-nums tracking-tight text-[hsl(var(--foreground))]",
          size === "lg" ? "text-6xl md:text-7xl" : "text-4xl"
        )}
      >
        {display}
      </span>
      <span className="text-lg text-[hsl(var(--muted))]">/ 100</span>
      <span
        className={cn(
          "rounded-md border px-2 py-0.5 text-sm font-medium",
          meta.bgClass,
          meta.borderClass,
          meta.textClass
        )}
      >
        {meta.label}
      </span>
    </div>
  );
}

const SEGMENTS: Array<{ from: number; to: number; band: "FALSE" | "AVERAGE" | "TRUSTABLE" }> = [
  { from: 0, to: 40, band: "FALSE" },
  { from: 40, to: 80, band: "AVERAGE" },
  { from: 80, to: 100, band: "TRUSTABLE" },
];

export function TrustScale({
  score,
  className,
}: {
  score?: number;
  className?: string;
}) {
  const hasScore = score !== undefined;
  const pct = hasScore ? clamp(score!, 0, 100) : null;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <div className="flex h-2 w-full overflow-hidden rounded-full">
          {SEGMENTS.map((s) => {
            const meta = STATUS_META[s.band];
            return (
              <div
                key={s.band}
                style={{ width: `${s.to - s.from}%` }}
                className={cn("relative", meta.bgClass)}
              >
                <div
                  className={cn(
                    "absolute inset-y-0 left-1/2 w-px",
                    s.band !== "FALSE" && "bg-[hsl(var(--background))]"
                  )}
                />
              </div>
            );
          })}
        </div>

        {hasScore && pct !== null && (
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pct}%` }}
          >
            <span className="block size-4 rounded-full border-[3px] border-[hsl(var(--background))] bg-[hsl(var(--foreground))] shadow-sm" />
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-between text-[11px] font-medium text-[hsl(var(--muted))]">
        <span className="text-false">FALSE</span>
        <span className="text-average">AVERAGE</span>
        <span className="text-trustable">TRUSTABLE</span>
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-[hsl(var(--muted))]">
        <span>0</span>
        <span>40</span>
        <span>80</span>
        <span>100</span>
      </div>
    </div>
  );
}
