import { AppShell } from "@/components/AppShell";
import { MediaPreview } from "@/components/MediaPreview";
import { VerificationProgress } from "@/components/VerificationProgress";
import { PROCESSING_STEPS, generateReport } from "@/mock/engine";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { clearPendingInput, getPendingInput } from "./Verify";

const STEP_MS = 1300;

export default function Processing() {
  const [, setLocation] = useLocation();
  const [input] = useState(() => getPendingInput());
  const [stepIndex, setStepIndex] = useState(0);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!input) {
      setLocation("/verify", { replace: true });
      return;
    }
    if (stepIndex >= PROCESSING_STEPS.length) {
      const t = setTimeout(() => {
        setGenerating(true);
        const report = generateReport(input);
        clearPendingInput();
        setLocation(`/report/${report.id}`, { replace: true });
      }, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIndex((i) => i + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [stepIndex, input, setLocation]);

  if (!input) return null;

  const done = stepIndex;

  return (
    <AppShell>
      <div className="container max-w-3xl py-10 md:py-16">
        <div className="fade-in text-center">
          <p className="section-label">Analysis in progress</p>
          <h1 className="mt-3 text-balance text-3xl md:text-4xl">
            Building your evidence report
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[hsl(var(--muted))]">
            Analyzing multiple evidence signals — metadata, vision, weather and
            dated sources. This usually takes under a minute.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          {/* Media + claim */}
          <div className="order-2 md:order-1">
            <MediaPreview media={input.media} size="sm" className="md:aspect-[4/3]" />
            <div className="mt-3 rounded-lg border border-[hsl(var(--border))] p-4">
              <p className="text-xs text-[hsl(var(--muted))]">Claim under analysis</p>
              <p className="mt-1 text-sm font-medium leading-snug text-[hsl(var(--foreground))]">
                {input.claim.event}
              </p>
              <p className="mt-1 text-xs text-[hsl(var(--muted))]">
                {[input.claim.location, input.claim.date].filter(Boolean).join(" · ") || "No context provided"}
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div className="order-1 md:order-2">
            <VerificationProgress doneSteps={done} generating={generating} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
