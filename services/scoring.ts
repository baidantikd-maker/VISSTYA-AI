/** Per-module contribution caps on the 0–100 weighted total. */
export const DOMAIN_CAP = {
  metadata: 15,
  vision: 25,
  weather: 25,
  evidence: 35,
} as const;

export type DomainKey = keyof typeof DOMAIN_CAP;

export type ConfidenceLabel = "FALSE" | "AVERAGE" | "TRUSTABLE";

/** Status bands on the 0–100 weighted total (tune after real runs). */
export const STATUS_BAND_THRESHOLDS = {
  falseBelow: 40,
  averageBelow: 80,
} as const;

export interface ScoringModuleInput {
  score: number;
  maxScore: number;
}

/**
 * Clamp raw rubric points to [0, maxRaw].
 * When internal rubric max differs from domain cap, scale first:
 * normalizeModuleScore((raw / internalMax) * domainCap, domainCap).
 */
export function normalizeModuleScore(rawScore: number, maxRaw: number): number {
  if (maxRaw <= 0) return 0;
  return Math.min(maxRaw, Math.max(0, rawScore));
}

export function confidenceLabelFromTotal(totalScore: number): ConfidenceLabel {
  if (totalScore < STATUS_BAND_THRESHOLDS.falseBelow) return "FALSE";
  if (totalScore < STATUS_BAND_THRESHOLDS.averageBelow) return "AVERAGE";
  return "TRUSTABLE";
}

/**
 * Sum domain-normalized module scores (caps total 100) and assign status band.
 */
export function computeTotalWeighted(modules: ScoringModuleInput[]): {
  totalScore: number;
  confidenceLabel: ConfidenceLabel;
} {
  const totalScore = modules.reduce(
    (sum, module) =>
      sum + normalizeModuleScore(module.score, module.maxScore),
    0
  );

  const rounded =
    Math.round(Math.min(100, Math.max(0, totalScore)) * 100) / 100;

  return {
    totalScore: rounded,
    confidenceLabel: confidenceLabelFromTotal(rounded),
  };
}
