import { PROCESSING_STEPS } from "@/mock/engine";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";

const STEP_LABEL_KEY: Record<string, string> = {
  received: "processing.stepReceivedTitle",
  metadata: "processing.stepMetadataTitle",
  vision: "processing.stepVisionTitle",
  weather: "processing.stepWeatherTitle",
  evidence: "processing.stepEvidenceTitle",
  trust: "processing.stepTrustTitle",
};

const STEP_DETAIL_KEY: Record<string, string> = {
  received: "processing.stepReceivedDetail",
  metadata: "processing.stepMetadataDetail",
  vision: "processing.stepVisionDetail",
  weather: "processing.stepWeatherDetail",
  evidence: "processing.stepEvidenceDetail",
  trust: "processing.stepTrustDetail",
};

export function VerificationProgress({
  doneSteps,
  generating = false,
}: {
  doneSteps: number;
  generating?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <div>
      <ol className="space-y-0">
        {PROCESSING_STEPS.map((step, i) => {
          const state = i < doneSteps ? "done" : i === doneSteps ? "active" : "pending";
          return (
            <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                  state === "done" &&
                    "border-transparent bg-[hsl(var(--foreground))] text-[hsl(var(--background))]",
                  state === "active" && "border-[hsl(var(--foreground))]",
                  state === "pending" && "border-[hsl(var(--border))] text-[hsl(var(--muted))]"
                )}
              >
                {state === "done" ? (
                  <Check className="size-3.5" strokeWidth={2.5} />
                ) : state === "active" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <span className="size-1.5 rounded-full bg-[hsl(var(--border))]" />
                )}
              </span>
              <div className="-mt-0.5">
                <p
                  className={cn(
                    "text-sm font-medium",
                    state === "pending"
                      ? "text-[hsl(var(--muted))]"
                      : "text-[hsl(var(--foreground))]"
                  )}
                >
                  {t(STEP_LABEL_KEY[step.key] ?? step.label)}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-xs",
                    state === "pending"
                      ? "text-[hsl(var(--muted))]/70"
                      : "text-[hsl(var(--muted))]"
                  )}
                >
                  {t(STEP_DETAIL_KEY[step.key] ?? step.detail)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {generating && (
        <p className="mt-6 text-sm text-[hsl(var(--muted))]">
          {t("processing.generating")}
        </p>
      )}
    </div>
  );
}
