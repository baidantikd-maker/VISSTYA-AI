import type { VerificationReport } from "@/mock/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t, tr } = useLanguage();

  const MODULES: Array<{ key: "metadata" | "vision" | "weather" | "evidence"; title: string }> = [
    { key: "metadata", title: t("home.metadataTitle") },
    { key: "vision", title: t("home.visionTitle") },
    { key: "weather", title: t("home.weatherTitle") },
    { key: "evidence", title: t("home.evidenceTitle") },
  ];

  const defaultShare = () => {
    const url = `${window.location.origin}/share/${report.shareToken}`;
    navigator.clipboard
      ?.writeText(url)
      .then(() => toast.success(t("report.shareLinkCopied")))
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
          <p className="section-label mb-3">{t("report.mediaAnalysed")}</p>
          <MediaPreview media={report.media} size="lg" />
          <p className="mt-2 truncate text-xs text-[hsl(var(--muted))]">
            {report.media.fileName ?? t("report.mediaFromUrl")} · {report.media.kind}
            {report.media.mime ? ` · ${report.media.mime}` : ""}
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <div>
            <p className="section-label mb-3">{t("report.claim")}</p>
            <div className="panel-subtle space-y-4 p-4">
              <MetaRow icon={<Newspaper className="size-4" />} label={t("report.claimMade")} value={report.claim.event} />
              {report.claim.location && (
                <MetaRow icon={<MapPin className="size-4" />} label={t("report.location")} value={report.claim.location} />
              )}
              {report.claim.date && (
                <MetaRow icon={<CalendarDays className="size-4" />} label={t("report.claimedDate")} value={report.claim.date} />
              )}
            </div>
          </div>
          <div>
            <p className="section-label mb-3">{t("report.trustScore")}</p>
            <div className="panel p-5">
              <TrustScore score={report.totalScore} />
              <TrustScale score={report.totalScore} className="mt-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border-y border-[hsl(var(--border))] py-8">
        <p className="section-label mb-3">{t("report.summary")}</p>
        <p className="max-w-3xl text-[15px] leading-relaxed text-[hsl(var(--foreground))]">
          {report.summary}
        </p>
        <WarningBanner title={t("report.whatThisReportIs")} className="mt-5">
          {t("report.whatThisReportIsDetail")}
        </WarningBanner>
      </div>

      {/* Modules */}
      <div className="py-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="section-label">{t("report.analysis")}</p>
            <h2 className="mt-2 text-xl md:text-2xl">{t("report.howEachScored")}</h2>
          </div>
          <p className="hidden text-sm text-[hsl(var(--muted))] sm:block">
            {t("report.moduleBreakdown")}
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
            <p className="section-label">{t("report.evidence")}</p>
            <h2 className="mt-2 text-xl md:text-2xl">
              {t("report.sourcesExamined", { count: report.sources.length })}
            </h2>
          </div>
          <p className="hidden text-sm text-[hsl(var(--muted))] sm:block">
            {t("report.sourcesNote")}
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
        <p className="section-label">{t("report.sequence")}</p>
        <h2 className="mt-2 text-xl md:text-2xl">{t("report.evidenceTimeline")}</h2>
        <div className="mt-6 max-w-2xl">
          <EvidenceTimeline events={report.timeline} />
        </div>
      </div>

      {/* Limitations */}
      <div className="border-t border-[hsl(var(--border))] py-8">
        <p className="section-label">{t("report.caveats")}</p>
        <h2 className="mt-2 text-xl md:text-2xl">{t("report.importantLimitations")}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {report.limitations.map((lim) => (
            <div key={lim.title} className="card-glow rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))]">
                <ShieldAlert className="size-4 text-average" />
                {tr(lim.title)}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[hsl(var(--muted))]">
                {tr(lim.detail)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 border-t border-[hsl(var(--border))] py-8">
        <Button onClick={exportReport} variant="outline">
          <FileDown className="size-4" />
          {t("report.exportPdf")}
        </Button>
        <Button onClick={shareReport} variant="outline">
          <Link2 className="size-4" />
          {t("report.shareReport")}
        </Button>
        <Button onClick={rerun} variant="outline" className="ml-auto">
          <RotateCcw className="size-4" />
          {t("report.runAgain")}
        </Button>
      </div>
    </div>
  );
}
