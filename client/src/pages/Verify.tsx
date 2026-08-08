import { AppShell } from "@/components/AppShell";
import { ClaimForm } from "@/components/ClaimForm";
import LightRays from "@/components/LightRays/LightRays";
import { UploadDropzone } from "@/components/UploadDropzone";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
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
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";
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
      <div className="relative min-h-[85vh] overflow-hidden">
        {isDark && (
          <div className="pointer-events-none absolute inset-0 z-0">
            <LightRays
              raysOrigin="top-center"
              raysColor="#7E3FF3"
              raysSpeed={1.5}
              lightSpread={0.8}
              rayLength={1.2}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
            />
          </div>
        )}

        <div className="relative z-10">
          <div className="container max-w-3xl py-10 md:py-16">
            <div className="fade-in text-center">
              <p className="section-label eyebrow-glow">{t("verify.eyebrow")}</p>
              <h1 className="section-title-glow mt-3 text-balance text-4xl md:text-5xl">
                {t("verify.title")}
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-[hsl(var(--muted))]">
                {t("verify.detail")}
              </p>
            </div>

        {/* Step indicator */}
        <div className="mt-8 flex items-center gap-3">
          {[1, 2].map((s) => (
            <div key={s} className="flex flex-1 items-center gap-3">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  isDark
                    ? step >= s
                      ? "border-transparent bg-[hsl(261_88%_60%)] text-white"
                      : "border-white text-white"
                    : step >= s
                      ? "border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                      : "border-[hsl(var(--border))] text-[hsl(var(--muted))]"
                )}
              >
                {s}
              </span>
              <span
                className={cn(
                  "text-sm",
                  isDark
                    ? cn(
                        "font-medium text-[hsl(261_88%_60%)]",
                        step < s && "opacity-80"
                      )
                    : step >= s
                      ? "font-medium text-[hsl(var(--foreground))]"
                      : "text-[hsl(var(--muted))]"
                )}
              >
                {s === 1 ? t("verify.stepAdd") : t("verify.stepContext")}
              </span>
              {s === 1 && (
                <span
                  className={cn(
                    "h-px flex-1",
                    isDark
                      ? "bg-white/70 shadow-[0_0_6px_rgba(255,255,255,0.7),0_0_12px_rgba(255,255,255,0.35)]"
                      : "bg-[hsl(var(--border))]"
                  )}
                />
              )}
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
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-md px-6 transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40",
                    isDark
                      ? "justify-center bg-[hsl(261_88%_60%)] text-base font-bold text-white"
                      : "gap-2 bg-[hsl(var(--primary))] text-sm font-medium text-[hsl(var(--primary-foreground))]"
                  )}
                >
                  {t("common.continue")}
                  {!isDark && <ArrowRight className="size-4" />}
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
                  {t("common.back")}
                </button>
                <button
                  type="button"
                  disabled={!canAnalyze}
                  onClick={submit}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[hsl(var(--primary))] px-6 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
                >
                  {t("verify.analyzeEvidence")}
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
          </div>
        </div>
    </AppShell>
  );
}
