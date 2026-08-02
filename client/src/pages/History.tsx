import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { AlertCircle, Loader2, ChevronRight } from "lucide-react";

export default function History() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data: reports, isLoading, error } = trpc.verification.getHistory.useQuery(
    { limit: 50 },
    { enabled: isAuthenticated }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">Sign In Required</h1>
          <Button onClick={() => setLocation("/")} className="w-full">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const statusColor = {
    FALSE: "text-red-600 bg-red-50",
    AVERAGE: "text-yellow-600 bg-yellow-50",
    TRUSTABLE: "text-green-600 bg-green-50",
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <div className="border-b" style={{ borderBottomColor: "hsl(var(--border))" }}>
        <div className="container py-6">
          <h1 className="text-3xl font-bold">Verification History</h1>
          <p className="text-[hsl(var(--muted))] mt-2">View your past verification reports</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold">Error Loading History</h2>
            <p className="text-[hsl(var(--muted))]">{error.message}</p>
            <Button onClick={() => setLocation("/")} className="w-full">
              Back to Home
            </Button>
          </div>
        ) : !reports || reports.length === 0 ? (
          <div className="max-w-md mx-auto text-center space-y-4 py-12">
            <h2 className="text-xl font-bold">No Verifications Yet</h2>
            <p className="text-[hsl(var(--muted))]">Start by verifying your first piece of media</p>
            <Button
              onClick={() => setLocation("/verify")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground w-full"
            >
              Verify Media
            </Button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="mb-6">
              <p className="text-sm text-[hsl(var(--muted))]">{reports.length} verification(s)</p>
            </div>

            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="card-minimal cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setLocation(`/report/${report.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[report.statusBand]}`}>
                          {report.statusBand}
                        </div>
                        <div className="text-2xl font-bold text-accent">
                          {Math.round(Number(report.totalScore))}/100
                        </div>
                      </div>

                      <div className="text-sm text-[hsl(var(--muted))] space-y-1">
                        {report.claimEvent && <p><strong>Event:</strong> {report.claimEvent.substring(0, 60)}...</p>}
                        {report.claimLocation && <p><strong>Location:</strong> {report.claimLocation}</p>}
                        {report.claimDate && <p><strong>Date:</strong> {new Date(report.claimDate).toLocaleDateString()}</p>}
                      </div>

                      <p className="text-xs text-[hsl(var(--muted))] mt-2">
                        {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-[hsl(var(--muted))] flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center pt-8">
              <Button
                onClick={() => setLocation("/verify")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Verify Another
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/")}
              >
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
