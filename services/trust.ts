import { MetadataResult, VisionResult, WeatherResult, EvidenceResult, TrustResult, TrustBand } from "./types.js";

const moduleWeights = {
  metadata: 0.15,
  vision: 0.25,
  weather: 0.25,
  evidence: 0.35,
} as const;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const labelFromScore = (score: number): TrustBand => {
  if (score < 40) return "FALSE";
  if (score < 80) return "AVERAGE";
  return "TRUSTABLE";
};

const normalizeModuleScore = (score: number): number => clamp(Math.round(score), 0, 100);

const computeModuleScore = (module: number, weight: number) =>
  Math.round(module * weight * 100) / 100;

const formatPercent = (value: number) => `${Math.round(value)}%`;

export function calculateTrust(
  metadata: MetadataResult,
  vision: VisionResult,
  weather: WeatherResult,
  evidence: EvidenceResult
): TrustResult {
  const moduleScores = {
    metadata: normalizeModuleScore(metadata.quality * 100),
    vision: normalizeModuleScore(vision.confidence * 100),
    weather: normalizeModuleScore(weather.matchScore * 100),
    evidence: normalizeModuleScore(evidence.confidence * 100),
  };

  const weightedScores = {
    metadata: computeModuleScore(moduleScores.metadata, moduleWeights.metadata),
    vision: computeModuleScore(moduleScores.vision, moduleWeights.vision),
    weather: computeModuleScore(moduleScores.weather, moduleWeights.weather),
    evidence: computeModuleScore(moduleScores.evidence, moduleWeights.evidence),
  };

  const totalScore = Object.values(weightedScores).reduce((sum, value) => sum + value, 0);
  const trustBadge = labelFromScore(totalScore);

  const explanation = [
    `Metadata quality is ${formatPercent(moduleScores.metadata)}.`,
    `Vision confidence is ${formatPercent(moduleScores.vision)}.`,
    `Weather match score is ${formatPercent(moduleScores.weather)}.`,
    `Evidence confidence is ${formatPercent(moduleScores.evidence)}.`,
    `Weighted trust total is ${formatPercent(totalScore)} for badge ${trustBadge}.`,
  ].join(" ");

  return {
    totalScore: Math.round(totalScore * 100) / 100,
    trustBadge,
    moduleWeights: {
      metadata: moduleWeights.metadata,
      vision: moduleWeights.vision,
      weather: moduleWeights.weather,
      evidence: moduleWeights.evidence,
    },
    moduleScores,
    explanation,
  };
}
