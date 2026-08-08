import { Logo } from "@/components/Logo";
import { ErrorState } from "@/components/States";
import { TrustReportView } from "@/components/TrustReportView";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockStore } from "@/mock/store";
import { useRoute } from "wouter";

export default function Share() {
  const [, params] = useRoute("/share/:token");
  const { t } = useLanguage();
  const token = params?.token ? String(params.token) : null;
  const report = token ? mockStore.getByShareToken(token) : undefined;

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))/85] backdrop-blur-md">
        <div className="container flex min-h-14 flex-wrap items-center justify-between gap-y-1">
          <Logo />
          <span className="text-xs text-[hsl(var(--muted))]">
            {t("report.poweredBy")}
          </span>
        </div>
      </header>

      <main className="container max-w-5xl py-10 md:py-14">
        {report ? (
          <TrustReportView report={report} isPublic />
        ) : (
          <ErrorState
            title={t("report.sharedReportNotFoundTitle")}
            description={t("report.sharedReportNotFoundDetail")}
          />
        )}
      </main>
    </div>
  );
}
