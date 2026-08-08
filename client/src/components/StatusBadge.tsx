import { STATUS_META, scoreToBand } from "@/lib/status";
import type { StatusBand } from "@/mock/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export function StatusBadge({
  score,
  band,
  className,
  size = "md",
}: {
  score?: number;
  band?: StatusBand;
  className?: string;
  size?: "sm" | "md";
}) {
  const resolved = band ?? (score !== undefined ? scoreToBand(score) : "AVERAGE");
  const meta = STATUS_META[resolved];
  const { t } = useLanguage();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        meta.bgClass,
        meta.borderClass,
        meta.textClass,
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-0.5 text-xs",
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dotClass)} />
      {t(`status.${resolved.toLowerCase()}`)}
    </span>
  );
}
