import { AppShell } from "@/components/AppShell";
import LightRays from "@/components/LightRays/LightRays";
import { StatusBadge } from "@/components/StatusBadge";
import { useTheme } from "@/contexts/ThemeContext";
import { formatDate } from "@/lib/format";
import { mockStore } from "@/mock/store";
import { ArrowRight, Plus } from "lucide-react";
import { useMemo } from "react";
import { useLocation } from "wouter";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div className="panel panel-white-border p-5">
      <p className="text-sm text-[hsl(var(--muted))]">{label}</p>
      <p className={`mt-2 text-3xl font-medium tabular-nums text-[hsl(var(--foreground))] ${className ?? ""}`}>
        {value}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const reports = useMemo(() => mockStore.list(), []);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      trustable: reports.filter((r) => r.statusBand === "TRUSTABLE").length,
      average: reports.filter((r) => r.statusBand === "AVERAGE").length,
      false: reports.filter((r) => r.statusBand === "FALSE").length,
    };
  }, [reports]);

  const recent = reports.slice(0, 5);

  return (
    <AppShell>
      <div className="relative min-h-[85vh] overflow-hidden">
        {isDark && (
          <div className="pointer-events-none absolute inset-0 z-0">
            <LightRays
              raysOrigin="top-center"
              raysColor="#7E3FF3"
              raysSpeed={1.5}
              lightSpread={0.8}
              rayLength={1.2}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
            />
          </div>
        )}

        <div className="relative z-10">
      <div className="container max-w-5xl py-10 md:py-14">
        <div className="fade-in text-center">
          <p className="section-label">Overview</p>
          <h1 className="mt-3 text-balance text-3xl md:text-4xl">
            {greeting()}, <span className="text-[hsl(var(--muted))]">researcher</span>
          </h1>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setLocation("/verify")}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[hsl(var(--primary))] px-5 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              <Plus className="size-4" />
              New Verification
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total verifications" value={stats.total} />
          <StatCard label="Trustable" value={stats.trustable} className="text-trustable" />
          <StatCard label="Average" value={stats.average} className="text-average" />
          <StatCard label="False" value={stats.false} className="text-false" />
        </div>

        {/* Recent */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl">Recent verifications</h2>
            <button
              type="button"
              onClick={() => setLocation("/history")}
              className="link-arrow"
            >
              View all
              <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="panel mt-5 divide-y divide-[hsl(var(--border))] overflow-hidden">
            {recent.map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => setLocation(`/report/${report.id}`)}
                className="group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-[hsl(var(--secondary))/40]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-[hsl(var(--foreground))]">
                    {report.claim.event}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-[hsl(var(--muted))]">
                    {[report.claim.location, report.claim.date]
                      .filter(Boolean)
                      .join(" · ") || "No context"}{" "}
                    · {formatDate(report.createdAt)}
                  </span>
                </span>
                <StatusBadge score={report.totalScore} size="sm" />
                <span className="w-12 text-right text-lg font-medium tabular-nums text-[hsl(var(--foreground))]">
                  {report.totalScore}
                </span>
                <ArrowRight className="size-4 shrink-0 text-[hsl(var(--muted))] opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
        </div>
      </div>
      </div>
    </AppShell>
  );
}
