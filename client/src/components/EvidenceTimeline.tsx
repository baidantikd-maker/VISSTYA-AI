import type { TimelineEvent } from "@/mock/types";
import { formatDateTime } from "@/lib/format";
import { useLanguage } from "@/contexts/LanguageContext";

export function EvidenceTimeline({ events }: { events: TimelineEvent[] }) {
  const { tr } = useLanguage();
  const sorted = [...events].sort((a, b) => a.at.localeCompare(b.at));

  return (
    <ol className="relative space-y-0 border-l border-[hsl(var(--border))] pl-6">
      {sorted.map((ev, i) => (
        <li key={`${ev.at}-${i}`} className="relative pb-7 last:pb-0">
          <span className="absolute -left-[31px] top-1 size-2.5 rounded-full border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))]">
            <span className="absolute inset-0 -m-0.5 rounded-full border border-[hsl(var(--border))]" />
          </span>
          <p className="text-xs font-medium text-[hsl(var(--muted))]">
            {formatDateTime(ev.at)}
          </p>
          <p className="mt-1 text-sm font-medium text-[hsl(var(--foreground))]">
            {tr(ev.label)}
          </p>
          {ev.detail && (
            <p className="mt-1 text-sm leading-relaxed text-[hsl(var(--muted))]">
              {tr(ev.detail)}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
