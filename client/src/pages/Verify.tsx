import { AppShell } from "@/components/AppShell";
import { ClaimForm } from "@/components/ClaimForm";
import { UploadDropzone } from "@/components/UploadDropzone";
import { cn } from "@/lib/utils";
import type { AnalysisInput, ClaimContext, MediaInfo } from "@/mock/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const PENDING_KEY = "vistai.mock.pending";

export function setPendingInput(input: AnalysisInput) {
  sessionStorage.setItem(PENDING_KEY, JSON.stringify(input));
}

export function getPendingInput(): AnalysisInput | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AnalysisInput;
    return parsed.media && parsed.claim ? parsed : null;
  } catch {
    return null;
  }
}

export function clearPendingInput() {
  sessionStorage.removeItem(PENDING_KEY);
}

export default function Verify() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<1 | 2>(1);
  const [media, setMedia] = useState<MediaInfo | null>(null);
  const [claim, setClaim] = useState<ClaimContext>({ event: "" });

  const canProceedToContext = Boolean(media);
  const canAnalyze = canProceedToContext && claim.event.trim().length > 2;

  const submit = () => {
    if (!media || !canAnalyze) return;
    setPendingInput({
      media,
      claim: {
        event: claim.event.trim(),
        location: claim.location?.trim() || undefined,
        date: claim.date?.trim() || undefined,
      },
    });
    setLocation("/verify/processing");
  };

  return (
    <AppShell>
      <div className="container max-w-3xl py-10 md:py-16">
        <div className="fade-in text-center">
          <p className="section-label">New verification</p>
          <h1 className="mt-3 text-balance text-4xl md:text-5xl">
            Verify a piece of content
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[hsl(var(--muted))]">
            Add the media, then tell us the claim being made about it. Visstya
            will compare it against evidence and show you how well it holds up.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mt-8 flex items-center gap-3">
          {[1, 2].map((s) => (
            <div key={s} className="flex flex-1 items-center gap-3">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  step >= s
                    ? "border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                    : "border-[hsl(var(--border))] text-[hsl(var(--muted))]"
                )}
              >
                {s}
              </span>
              <span
                className={cn(
                  "text-sm",
                  step >= s
                    ? "font-medium text-[hsl(var(--foreground))]"
                    : "text-[hsl(var(--muted))]"
                )}
              >
                {s === 1 ? "Add content" : "Claim context"}
              </span>
              {s === 1 && <span className="h-px flex-1 bg-[hsl(var(--border))]" />}
            </div>
          ))}
        </div>

        <div className="mt-10">
          {step === 1 ? (
            <div className="scale-in">
              <UploadDropzone value={media} onChange={setMedia} />
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  disabled={!canProceedToContext}
                  onClick={() => setStep(2)}
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-[hsl(var(--primary))] px-6 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="scale-in">
              <ClaimForm value={claim} onChange={setClaim} />
              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-[hsl(var(--muted))] transition-colors hover:text-[hsl(var(--foreground))]"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={!canAnalyze}
                  onClick={submit}
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-[hsl(var(--primary))] px-6 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
                >
                  Analyze Evidence
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
