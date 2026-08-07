import type { Source } from "@/mock/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const LABEL_CLASS: Record<Source["label"], string> = {
  Supporting: "text-trustable",
  Contradicting: "text-false",
  Inconclusive: "text-average",
};

export function SourceCard({ source }: { source: Source }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-glow group block rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 transition-colors hover:border-[hsl(var(--foreground))/20]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-[hsl(var(--foreground))]">
          {source.name}
          <ExternalLink className="size-3 text-[hsl(var(--muted))]" />
        </span>
        <span className={cn("shrink-0 text-xs font-medium", LABEL_CLASS[source.label])}>
          {source.label}
        </span>
      </div>

      <p className="mt-2 text-sm font-medium leading-snug text-[hsl(var(--foreground))]">
        {source.headline}
      </p>

      <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted))]">
        {source.snippet}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-[hsl(var(--muted))]">
          {formatDate(source.publishedAt)} · {source.domain}
        </span>
        <span className="link-arrow">
          Open source
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </a>
  );
}
