import { AppShell } from "@/components/AppShell";
import { ErrorState } from "@/components/States";
import { TrustReportView } from "@/components/TrustReportView";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockStore } from "@/mock/store";
import { useRoute } from "wouter";

export default function Report() {
  const [, params] = useRoute("/report/:id");
  const { t } = useLanguage();
  const reportId = params?.id;

  const report = reportId ? mockStore.getById(reportId) : undefined;

  return (
    <AppShell>
      <div className="container max-w-5xl py-10 md:py-14">
        {report === undefined ? (
          <ErrorState
            title={t("report.notFoundTitle")}
            description={t("report.notFoundDetail")}
          />
        ) : (
          <TrustReportView report={report} />
        )}
      </div>
    </AppShell>
  );
}
