import { analyzeMediaWithGemini } from "./gemini.js";
import { MediaType, VisionResult, ClaimConsistency } from "./types.js";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const normalizeConsistency = (
  claimEvent?: string,
  claimLocation?: string,
  eventConsistency?: ClaimConsistency | null,
  locationConsistency?: ClaimConsistency | null
): ClaimConsistency => {
  if (claimEvent && eventConsistency) return eventConsistency;
  if (claimLocation && locationConsistency) return locationConsistency;
  return "inconclusive";
};

const toNullableString = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const normalized = String(value).trim();
  return normalized.length === 0 ? null : normalized;
};

export async function analyzeVision(
  mediaUrl: string | null,
  mediaType: MediaType,
  claimEvent?: string,
  claimLocation?: string,
  mediaBytes?: Uint8Array | Buffer,
  mediaFilename?: string
): Promise<VisionResult> {
  const findings: string[] = [];
  let confidence = 0.1;
  let explanation = "No vision output could be produced.";

  try {
    const analysis = await analyzeMediaWithGemini({
      mediaUrl: mediaUrl ?? undefined,
      mediaType,
      claimEvent,
      claimLocation,
      mediaBytes,
      mediaFilename,
    });

    const detectedScene = toNullableString(analysis.description) ?? "unknown";
    const detectedWeather = toNullableString(analysis.weatherCues);
    const estimatedTimeOfDay = toNullableString(analysis.timeOfDay);
    const visibleText = Array.isArray(analysis.visibleText)
      ? analysis.visibleText.filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0
        )
      : [];

    findings.push(`Scene description: ${detectedScene}`);
    confidence += detectedScene !== "unknown" ? 0.15 : 0;

    if (analysis.objectsDetected.length > 0) {
      findings.push(`Objects detected: ${analysis.objectsDetected.join(", ")}`);
      confidence += Math.min(0.25, analysis.objectsDetected.length * 0.05);
    } else {
      findings.push("No clear objects were detected.");
    }

    if (detectedWeather) {
      findings.push(`Visible weather cues: ${detectedWeather}`);
      confidence += 0.12;
    }

    if (estimatedTimeOfDay) {
      findings.push(`Estimated time of day: ${estimatedTimeOfDay}`);
      confidence += 0.1;
    }

    if (analysis.locationClues.length > 0) {
      findings.push(`Location clues: ${analysis.locationClues.join(", ")}`);
      confidence += 0.08;
    }

    if (analysis.manipulationSigns.length > 0) {
      findings.push(
        `Potential manipulation indicators: ${analysis.manipulationSigns.join(", ")}`
      );
      confidence -= 0.18;
    }

    const claimConsistency = normalizeConsistency(
      claimEvent,
      claimLocation,
      analysis.eventConsistency,
      analysis.locationConsistency
    );

    if (claimEvent && analysis.eventConsistency) {
      findings.push(`Event claim consistency: ${analysis.eventConsistency}`);
    }
    if (claimLocation && analysis.locationConsistency) {
      findings.push(`Location claim consistency: ${analysis.locationConsistency}`);
    }

    explanation = `Vision analysis returned a scene assessment with ${
      analysis.objectsDetected.length
    } object detection results and ${analysis.manipulationSigns.length} manipulation clue(s).`;

    return {
      detectedObjects: analysis.objectsDetected,
      detectedScene,
      detectedWeather,
      estimatedTimeOfDay,
      visibleText,
      confidence: clamp(confidence, 0, 1),
      claimConsistency,
      explanation,
      findings,
      details: analysis,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    findings.push(`Vision analysis failed: ${message}`);
    return {
      detectedObjects: [],
      detectedScene: "unknown",
      detectedWeather: null,
      estimatedTimeOfDay: null,
      visibleText: [],
      confidence: 0,
      claimConsistency: "inconclusive",
      explanation: `Vision module failed: ${message}`,
      findings,
      details: { error: message },
    };
  }
}
