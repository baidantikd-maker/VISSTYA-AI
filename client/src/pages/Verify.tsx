import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Verify() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [claimEvent, setClaimEvent] = useState("");
  const [claimLocation, setClaimLocation] = useState("");
  const [claimDate, setClaimDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const analyzeMutation = trpc.verification.analyze.useMutation({
    onSuccess: (report) => {
      setIsLoading(false);
      toast.success("Verification complete!");
      setLocation(`/report/${report.id}`);
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.message || "Verification failed");
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">Sign In Required</h1>
          <p className="text-[hsl(var(--muted))]">Please sign in to verify media content.</p>
          <Button onClick={() => setLocation("/")} className="w-full">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mediaUrl.trim()) {
      toast.error("Please enter a media URL");
      return;
    }

    setIsLoading(true);
    try {
      await analyzeMutation.mutateAsync({
        mediaUrl,
        mediaType,
        claimEvent: claimEvent || undefined,
        claimLocation: claimLocation || undefined,
        claimDate: claimDate ? new Date(claimDate) : undefined,
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <div className="border-b" style={{ borderBottomColor: "hsl(var(--border))" }}>
        <div className="container py-6">
          <h1 className="text-3xl font-bold">Verify Media</h1>
          <p className="text-[hsl(var(--muted))] mt-2">Upload or paste a URL to analyze media authenticity</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Media Input Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Media Input
              </h2>

              <div className="space-y-2">
                <Label htmlFor="media-url">Media URL *</Label>
                <Input
                  id="media-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-[hsl(var(--card))]"
                />
                <p className="text-xs text-[hsl(var(--muted))]">Enter a direct link to an image or video file</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="media-type">Media Type *</Label>
                <div className="flex gap-4">
                  {(["image", "video"] as const).map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="media-type"
                        value={type}
                        checked={mediaType === type}
                        onChange={(e) => setMediaType(e.target.value as "image" | "video")}
                        disabled={isLoading}
                        className="w-4 h-4"
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Claim Context Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Claim Context (Optional)</h2>
              <p className="text-sm text-[hsl(var(--muted))]">
                Provide details about the claim to improve verification accuracy
              </p>

              <div className="space-y-2">
                <Label htmlFor="claim-event">Event Description</Label>
                <Textarea
                  id="claim-event"
                  placeholder="What event or claim does this media represent?"
                  value={claimEvent}
                  onChange={(e) => setClaimEvent(e.target.value)}
                  disabled={isLoading}
                  className="bg-[hsl(var(--card))] min-h-24"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="claim-location">Location</Label>
                  <Input
                    id="claim-location"
                    placeholder="e.g., New Delhi, India"
                    value={claimLocation}
                    onChange={(e) => setClaimLocation(e.target.value)}
                    disabled={isLoading}
                    className="bg-[hsl(var(--card))]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claim-date">Date</Label>
                  <Input
                    id="claim-date"
                    type="date"
                    value={claimDate}
                    onChange={(e) => setClaimDate(e.target.value)}
                    disabled={isLoading}
                    className="bg-[hsl(var(--card))]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading || !mediaUrl.trim()}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Start Verification
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/")}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>

            {/* Info Box */}
            <div className="bg-[hsl(var(--secondary))]/30 rounded-lg p-4 border" style={{ borderColor: "hsl(var(--border))" }}>
              <h3 className="font-semibold mb-2">How Verification Works</h3>
              <ul className="text-sm text-[hsl(var(--muted))] space-y-1">
                <li>• Metadata Analysis: Checks EXIF data and file integrity</li>
                <li>• Vision Analysis: AI examines visual content and objects</li>
                <li>• Weather Verification: Cross-checks location and date against historical data</li>
                <li>• Evidence Corroboration: Searches trusted sources for supporting evidence</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
