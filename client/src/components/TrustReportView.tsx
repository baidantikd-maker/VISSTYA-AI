import type { VerificationReport } from "@/mock/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  FileDown,
  Link2,
  MapPin,
  Newspaper,
  RotateCcw,
  ShieldAlert,
  CalendarDays,
} from "lucide-react";
import { useLocation } from "wouter";
import { EvidenceTimeline } from "./EvidenceTimeline";
import { MediaPreview } from "./MediaPreview";
import { ModuleCard } from "./ModuleCard";
import { ReportHeader } from "./ReportHeader";
import { SourceCard } from "./SourceCard";
import { TrustScale, TrustScore } from "./TrustScore";
import { WarningBanner } from "./WarningBanner";

const MODULES: Array<{ key: "metadata" | "vision" | "weather" | "evidence"; title: string }> = [
  { key: "metadata", title: "Metadata" },
  { key: "vision", title: "Vision analysis" },
  { key: "weather", title: "Weather verification" },
  { key: "evidence", title: "Evidence corroboration" },
];

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[hsl(var(--muted))]">{icon}</span>
      <div>
        <p className="text-xs text-[hsl(var(--muted))]">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-[hsl(var(--foreground))]">{value}</p>
      </div>
    </div>
  );
}

export function TrustReportView({
  report,
  isPublic = false,
  onShare,
  onExport,
  onRerun,
}: {
  report: VerificationReport;
  isPublic?: boolean;
  onShare?: () => void;
  onExport?: () => void;
  onRerun?: () => void;
}) {
  const [, setLocation] = useLocation();

  const defaultShare = () => {
    const url = `${window.location.origin}/share/${report.shareToken}`;
    navigator.clipboard
      ?.writeText(url)
      .then(() => toast.success("Share link copied"))
      .catch(() => toast.info(url));
  };

  const defaultExport = () => {
    window.print();
  };

  const shareReport = onShare ?? defaultShare;
  const exportReport = onExport ?? defaultExport;
  const rerun = onRerun ?? (() => setLocation("/verify"));

  return (
    <div className="print-area fade-in">
      <ReportHeader report={report} isPublic={isPublic} />

      {/* Media + claim summary */}
      <div className="grid gap-8 py-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="section-label mb-3">Media analysed</p>
          <MediaPreview media={report.media} size="lg" />
          <p className="mt-2 truncate text-xs text-[hsl(var(--muted))]">
            {report.media.fileName ?? "Media from URL"} · {report.media.kind}
            {report.media.mime ? ` · ${report.media.mime}` : ""}
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <p className="section-label mb-3">Claim</p>
            <div className="panel-subtle space-y-4 p-4">
              <MetaRow icon={<Newspaper className="size-4" />} label="Claim made" value={report.claim.event} />
              {report.claim.location && (
                <MetaRow icon={<MapPin className="size-4" />} label="Location" value={report.claim.location} />
              )}
              {report.claim.date && (
                <MetaRow icon={<CalendarDays className="size-4" />} label="Claimed date" value={report.claim.date} />
              )}
            </div>
          </div>
          <div>
            <p className="section-label mb-3">Trust score</p>
            <div className="panel p-5">
              <TrustScore score={report.totalScore} />
              <TrustScale score={report.totalScore} className="mt-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border-y border-[hsl(var(--border))] py-8">
        <p className="section-label mb-3">Summary</p>
        <p className="max-w-3xl text-[15px] leading-relaxed text-[hsl(var(--foreground))]">
          {report.summary}
        </p>
        <WarningBanner title="What this report is" className="mt-5">
          Visstya rates how well evidence supports a claim — it does not declare
          ground truth. The verdict reflects the evidence available at analysis
          time and can change as new evidence emerges.
        </WarningBanner>
      </div>

      {/* Modules */}
      <div className="py-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="section-label">Analysis</p>
            <h2 className="mt-2 text-xl md:text-2xl">How each evidence signal scored</h2>
          </div>
          <p className="hidden text-sm text-[hsl(var(--muted))] sm:block">
            Metadata /15 · Vision /25 · Weather /25 · Evidence /35
          </p>
        </div>
        <div className="space-y-3">
          {MODULES.map((m, i) => (
            <ModuleCard
              key={m.key}
              index={i + 1}
              title={m.title}
              module={report.modules[m.key]}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="border-t border-[hsl(var(--border))] py-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="section-label">Evidence</p>
            <h2 className="mt-2 text-xl md:text-2xl">
              Sources examined ({report.sources.length})
            </h2>
          </div>
          <p className="hidden text-sm text-[hsl(var(--muted))] sm:block">
            Each source is dated and independently verifiable
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {report.sources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="border-t border-[hsl(var(--border))] py-8">
        <p className="section-label">Sequence</p>
        <h2 className="mt-2 text-xl md:text-2xl">Evidence timeline</h2>
        <div className="mt-6 max-w-2xl">
          <EvidenceTimeline events={report.timeline} />
        </div>
      </div>

      {/* Limitations */}
      <div className="border-t border-[hsl(var(--border))] py-8">
        <p className="section-label">Caveats</p>
        <h2 className="mt-2 text-xl md:text-2xl">Important limitations</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {report.limitations.map((lim) => (
            <div key={lim.title} className="card-glow rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))]">
                <ShieldAlert className="size-4 text-average" />
                {lim.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[hsl(var(--muted))]">
                {lim.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 border-t border-[hsl(var(--border))] py-8">
        <Button onClick={exportReport} variant="outline">
          <FileDown className="size-4" />
          Export PDF
        </Button>
        <Button onClick={shareReport} variant="outline">
          <Link2 className="size-4" />
          Share Report
        </Button>
        <Button onClick={rerun} variant="outline" className="ml-auto">
          <RotateCcw className="size-4" />
          Run Again
        </Button>
      </div>
    </div>
  );
}
