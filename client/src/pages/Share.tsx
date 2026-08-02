import { Button } from "@/components/ui/button";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react";

export default function Share() {
  const [match, params] = useRoute("/share/:token");
  const [, setLocation] = useLocation();

  const shareToken = params?.token ? String(params.token) : null;

  const { data: report, isLoading, error } = trpc.verification.getPublic.useQuery(
    { shareToken: shareToken! },
    { enabled: !!shareToken }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">Report Not Found</h1>
          <p className="text-[hsl(var(--muted))]">This report is not available or has been removed.</p>
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

  const statusBgColor = {
    FALSE: "bg-red-100",
    AVERAGE: "bg-yellow-100",
    TRUSTABLE: "bg-green-100",
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <div className="border-b" style={{ borderBottomColor: "hsl(var(--border))" }}>
        <div className="container py-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Shared Trust Report</h1>
          <p className="text-[hsl(var(--muted))] mt-2">Public verification report</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overall Score Card */}
          <div className={`rounded-lg p-8 text-center ${statusBgColor[report.statusBand]}`}>
            <div className="space-y-4">
              <div className="text-6xl font-bold">{Math.round(Number(report.totalScore))}</div>
              <div className={`text-2xl font-semibold ${statusColor[report.statusBand]}`}>
                {report.statusBand}
              </div>
              <p className="text-sm max-w-2xl mx-auto">
                {report.summary}
              </p>
            </div>
          </div>

          {/* Module Scores Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Metadata */}
            <div className="card-minimal">
              <h3 className="text-lg font-semibold mb-2">Metadata Analysis</h3>
              <div className="text-3xl font-bold text-accent mb-4">
                {Math.round(Number(report.metadataScore))}/15
              </div>
              <div className="space-y-2">
                {report.metadataFindings && typeof report.metadataFindings === "object" ? (
                  <div className="text-sm text-[hsl(var(--muted))] space-y-1">
                    {Object.entries(report.metadataFindings).map(([key, value]) => (
                      <p key={key}>
                        <strong>{key}:</strong> {String(value as unknown)}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[hsl(var(--muted))]">No metadata findings</p>
                )}
              </div>
            </div>

            {/* Vision */}
            <div className="card-minimal">
              <h3 className="text-lg font-semibold mb-2">Vision Analysis</h3>
              <div className="text-3xl font-bold text-accent mb-4">
                {Math.round(Number(report.visionScore))}/25
              </div>
              <div className="space-y-2">
                {report.visionFindings && typeof report.visionFindings === "object" ? (
                  <div className="text-sm text-[hsl(var(--muted))] space-y-1">
                    {Object.entries(report.visionFindings).map(([key, value]) => (
                      <p key={key}>
                        <strong>{key}:</strong> {String(value as unknown)}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[hsl(var(--muted))]">No vision findings</p>
                )}
              </div>
            </div>

            {/* Weather */}
            <div className="card-minimal">
              <h3 className="text-lg font-semibold mb-2">Weather Verification</h3>
              <div className="text-3xl font-bold text-accent mb-4">
                {Math.round(Number(report.weatherScore))}/25
              </div>
              <div className="space-y-2">
                {report.weatherFindings && typeof report.weatherFindings === "object" ? (
                  <div className="text-sm text-[hsl(var(--muted))] space-y-1">
                    {Object.entries(report.weatherFindings).map(([key, value]) => (
                      <p key={key}>
                        <strong>{key}:</strong> {String(value as unknown)}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[hsl(var(--muted))]">No weather findings</p>
                )}
              </div>
            </div>

            {/* Evidence */}
            <div className="card-minimal">
              <h3 className="text-lg font-semibold mb-2">Evidence Corroboration</h3>
              <div className="text-3xl font-bold text-accent mb-4">
                {Math.round(Number(report.evidenceScore))}/35
              </div>
              <div className="space-y-2">
                {report.evidenceFindings && typeof report.evidenceFindings === "object" ? (
                  <div className="text-sm text-[hsl(var(--muted))] space-y-1">
                    {Object.entries(report.evidenceFindings).map(([key, value]) => (
                      <p key={key}>
                        <strong>{key}:</strong> {String(value as unknown)}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[hsl(var(--muted))]">No evidence findings</p>
                )}
              </div>
            </div>
          </div>

          {/* Claim Details */}
          <div className="card-minimal">
            <h3 className="text-lg font-semibold mb-4">Claim Details</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {report.claimEvent && (
                <div>
                  <p className="font-semibold text-[hsl(var(--muted))]">Event</p>
                  <p>{report.claimEvent}</p>
                </div>
              )}
              {report.claimLocation && (
                <div>
                  <p className="font-semibold text-[hsl(var(--muted))]">Location</p>
                  <p>{report.claimLocation}</p>
                </div>
              )}
              {report.claimDate && (
                <div>
                  <p className="font-semibold text-[hsl(var(--muted))]">Date</p>
                  <p>{new Date(report.claimDate).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <p className="font-semibold text-[hsl(var(--muted))]">Media Type</p>
                <p className="capitalize">{report.mediaType}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-[hsl(var(--muted))]">
            <p>This is a publicly shared verification report from Visstya AI</p>
            <p>Generated on {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
