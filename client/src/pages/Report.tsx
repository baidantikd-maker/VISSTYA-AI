import { AppShell } from "@/components/AppShell";
import { ErrorState } from "@/components/States";
import { TrustReportView } from "@/components/TrustReportView";
import { mockStore } from "@/mock/store";
import { useRoute } from "wouter";

export default function Report() {
  const [, params] = useRoute("/report/:id");
  const reportId = params?.id;

  const report = reportId ? mockStore.getById(reportId) : undefined;

  return (
    <AppShell>
      <div className="container max-w-5xl py-10 md:py-14">
        {report === undefined ? (
          <ErrorState
            title="Report not found"
            description="We could not find that verification report. It may have been removed, or the link may be incorrect."
          />
        ) : (
          <TrustReportView report={report} />
        )}
      </div>
    </AppShell>
  );
}
