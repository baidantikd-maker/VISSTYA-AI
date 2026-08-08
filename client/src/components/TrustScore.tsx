import { STATUS_META, scoreToBand } from "@/lib/status";
import { clamp } from "@/lib/format";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const band = scoreToBand(score);
  const meta = STATUS_META[band];
  const { t } = useLanguage();
  const bandLabel =
    band === "FALSE"
      ? t("status.false")
      : band === "AVERAGE"
        ? t("status.average")
        : t("status.trustable");

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
        {bandLabel}
      </span>
    </div>
  );
}

const SEGMENTS: Array<{
  from: number;
  to: number;
  band: "FALSE" | "AVERAGE" | "TRUSTABLE";
  scaleClass: string;
}> = [
  { from: 0, to: 40, band: "FALSE", scaleClass: "scale-false" },
  { from: 40, to: 80, band: "AVERAGE", scaleClass: "scale-average" },
  { from: 80, to: 100, band: "TRUSTABLE", scaleClass: "scale-trustable" },
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
  const { t } = useLanguage();

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <div className="flex h-2 w-full">
          {SEGMENTS.map((s, i) => {
            return (
              <div
                key={s.band}
                style={{ width: `${s.to - s.from}%` }}
                className={cn(
                  "relative",
                  s.scaleClass,
                  i === 0 && "rounded-l-full",
                  i === SEGMENTS.length - 1 && "rounded-r-full"
                )}
              />
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

      <div className="relative mt-2 h-4 text-[10px] font-medium text-[hsl(var(--foreground))]">
        <span className="absolute left-0 -translate-x-1/2">0</span>
        <span className="absolute left-[40%] -translate-x-1/2">40</span>
        <span className="absolute left-[80%] -translate-x-1/2">80</span>
        <span className="absolute left-full -translate-x-1/2">100</span>
      </div>
      <div className="relative mt-3 h-4 text-[11px] font-medium">
        <span className="absolute left-[20%] -translate-x-1/2 text-false">
          {t("status.lowConfidence")}
        </span>
        <span className="absolute left-[60%] -translate-x-1/2 text-average">
          {t("dashboard.average")}
        </span>
        <span className="absolute left-[90%] -translate-x-1/2 text-trustable">
          {t("dashboard.trustable")}
        </span>
      </div>
    </div>
  );
}
