import { Logo } from "@/components/Logo";
import { ErrorState } from "@/components/States";
import { TrustReportView } from "@/components/TrustReportView";
import { mockStore } from "@/mock/store";
import { useRoute } from "wouter";

export default function Share() {
  const [, params] = useRoute("/share/:token");
  const token = params?.token ? String(params.token) : null;
  const report = token ? mockStore.getByShareToken(token) : undefined;

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))/85] backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between">
          <Logo />
          <span className="text-xs text-[hsl(var(--muted))]">
            Powered by Visstya AI · Evidence-based verification
          </span>
        </div>
      </header>

      <main className="container max-w-5xl py-10 md:py-14">
        {report ? (
          <TrustReportView report={report} isPublic />
        ) : (
          <ErrorState
            title="Shared report not found"
            description="This share link does not match any report. The link may be expired or incorrect."
          />
        )}
      </main>
    </div>
  );
}
