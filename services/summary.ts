import { MetadataResult, VisionResult, WeatherResult, EvidenceResult, TrustResult } from "./types.js";

const summarizeSource = (
  sources: Array<{ title: string; provider: string; url: string; publishedAt: string | null }>
): string => {
  if (sources.length === 0) return "none";
  const first = sources[0];
  return `${first.provider} article titled “${first.title}”${first.publishedAt ? ` published ${first.publishedAt}` : ""}`;
};

export async function generateSummary(
  trust: TrustResult,
  metadata: MetadataResult,
  vision: VisionResult,
  weather: WeatherResult,
  evidence: EvidenceResult
): Promise<string> {
  const summaryParts: string[] = [];

  summaryParts.push(`Final trust badge: ${trust.trustBadge} with a score of ${trust.totalScore}/100.`);
  summaryParts.push(`Metadata score: ${Math.round(trust.moduleScores.metadata)}/100, Vision score: ${Math.round(trust.moduleScores.vision)}/100, Weather score: ${Math.round(trust.moduleScores.weather)}/100, Evidence score: ${Math.round(trust.moduleScores.evidence)}/100.`);

  if (metadata.hasExif) {
    summaryParts.push(
      `Metadata contains EXIF data${metadata.camera ? ` from ${metadata.camera}` : ""}${metadata.resolution ? ` at ${metadata.resolution}` : ""}${metadata.fileFormat ? ` (${metadata.fileFormat})` : ""}${metadata.exifDate ? ` with timestamp ${metadata.exifDate}` : ""}.`
    );
  } else {
    summaryParts.push("Metadata does not include EXIF information, so camera and GPS confidence are reduced.");
  }

  summaryParts.push(`Vision analysis described the scene as ${vision.detectedScene}.`);
  if (vision.detectedWeather) {
    summaryParts.push(`It noted weather cues: ${vision.detectedWeather}.`);
  }
  if (vision.estimatedTimeOfDay) {
    summaryParts.push(`Estimated time of day is ${vision.estimatedTimeOfDay}.`);
  }
  if (vision.visibleText.length > 0) {
    summaryParts.push(`Visible text extracted: ${vision.visibleText.join(", ")}.`);
  }
  if (vision.claimConsistency !== "inconclusive") {
    summaryParts.push(`Claim consistency from vision analysis is ${vision.claimConsistency}.`);
  }

  if (weather.isApplicable === false) {
    summaryParts.push("Weather verification was not applicable for this media.");
  } else if (weather.actualWeather) {
    summaryParts.push(`Historical weather for ${weather.resolvedLocation ?? weather.claimLocation} on ${weather.claimDate} was ${weather.actualWeather}.`);
    if (weather.visualWeather) {
      summaryParts.push(`Visual weather cues were ${weather.visualWeather}, ${weather.actualWeather === weather.visualWeather ? "which matches" : "which does not match"} historical records.`);
    }
  }

  if (evidence.evidenceFound) {
    summaryParts.push(`Strongest supporting evidence: ${summarizeSource(evidence.supportingSources)}.`);
  } else {
    summaryParts.push("No strong supporting evidence was found.");
  }

  if (evidence.conflictingSources.length > 0) {
    summaryParts.push(`Weakest/conflicting evidence: ${summarizeSource(evidence.conflictingSources)}.`);
  }

  summaryParts.push(`Evidence verdict: ${evidence.verdict}.`);
  summaryParts.push(trust.explanation);

  return summaryParts.join(" ");
}
