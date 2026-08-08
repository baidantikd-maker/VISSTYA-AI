import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/States";
import { StatusBadge } from "@/components/StatusBadge";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDate } from "@/lib/format";
import { STATUS_META, scoreToBand } from "@/lib/status";
import { cn } from "@/lib/utils";
import { mockStore } from "@/mock/store";
import type { StatusBand } from "@/mock/types";
import { ArrowRight, FileSearch, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

export default function History() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusBand | "ALL">("ALL");

  const FILTERS: Array<{ key: StatusBand | "ALL"; label: string }> = [
    { key: "ALL", label: t("history.filterAll") },
    { key: "FALSE", label: t("history.filterFalse") },
    { key: "AVERAGE", label: t("history.filterAverage") },
    { key: "TRUSTABLE", label: t("history.filterTrustable") },
  ];

  const reports = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockStore.list().filter((r) => {
      if (filter !== "ALL" && r.statusBand !== filter) return false;
      if (!q) return true;
      const haystack = [
        r.claim.event,
        r.claim.location ?? "",
        r.claim.date ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, filter]);

  return (
    <AppShell>
      <div className="container max-w-5xl py-10 md:py-14">
        <div className="fade-in text-center">
          <p className="section-label">{t("history.eyebrow")}</p>
          <h1 className="mt-3 text-balance text-3xl md:text-4xl">
            {t("history.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[hsl(var(--muted))]">
            {t("history.detail")}
          </p>
        </div>

        {/* Search + filters */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[hsl(var(--muted))]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("history.searchPlaceholder")}
              className="h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--card))] pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-[hsl(var(--muted))] focus:border-[hsl(var(--foreground))]"
            />
          </div>
          <div className="flex items-center gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  filter === f.key
                    ? "bg-[hsl(var(--primary))] font-medium text-[hsl(var(--primary-foreground))]"
                    : "text-[hsl(var(--muted))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--foreground))]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="mt-6">
          {reports.length === 0 ? (
            <EmptyState
              icon={<FileSearch className="size-7" strokeWidth={1.5} />}
              title={t("history.emptyTitle")}
              description={
                query || filter !== "ALL"
                  ? t("history.emptySearch")
                  : t("history.emptyFirst")
              }
            />
          ) : (
            <div className="panel divide-y divide-[hsl(var(--border))] overflow-hidden">
              {reports.map((report) => {
                const band = scoreToBand(report.totalScore);
                const meta = STATUS_META[band];
                return (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => setLocation(`/report/${report.id}`)}
                    className="group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-[hsl(var(--secondary))/40]"
                  >
                    <span
                      className={cn(
                        "hidden h-12 w-16 shrink-0 items-center justify-center rounded-md border text-[10px] font-medium sm:flex",
                        meta.bgClass,
                        meta.borderClass,
                        meta.textClass
                      )}
                    >
                      {report.media.kind}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-[hsl(var(--foreground))]">
                        {report.claim.event}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-[hsl(var(--muted))]">
                        {[report.claim.location, report.claim.date]
                          .filter(Boolean)
                          .join(" · ") || t("history.noContext")}
                        {" · "}
                        {formatDate(report.createdAt)}
                      </span>
                    </span>
                    <span className="hidden shrink-0 items-center gap-2 md:flex">
                      <StatusBadge score={report.totalScore} size="sm" />
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-lg font-medium tabular-nums text-[hsl(var(--foreground))]">
                        {report.totalScore}
                      </span>
                      <span className="block text-[10px] text-[hsl(var(--muted))]">/ 100</span>
                    </span>
                    <span className="link-arrow hidden sm:inline-flex">
                      {t("history.openReport")}
                      <ArrowRight className="size-4" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
