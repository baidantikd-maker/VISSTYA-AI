import { analyzeMetadata } from "./metadata.js";
import { analyzeVision } from "./vision.js";
import { analyzeWeather } from "./weather.js";
import { analyzeEvidence } from "./evidence.js";
import { calculateTrust } from "./trust.js";
import { generateSummary } from "./summary.js";
import {
  VerificationInput,
  VerificationResponse,
} from "./types.js";

export async function runVerification(
  input: VerificationInput
): Promise<VerificationResponse> {
  if (!input.mediaUrl && !input.mediaBytes) {
    throw new Error("Either mediaUrl or mediaBytes must be provided for verification.");
  }

  const [metadata, vision] = await Promise.all([
    analyzeMetadata(input.mediaUrl ?? null, input.mediaType, input.mediaBytes, input.mediaFilename),
    analyzeVision(
      input.mediaUrl ?? null,
      input.mediaType,
      input.claimEvent,
      input.claimLocation,
      input.mediaBytes,
      input.mediaFilename
    ),
  ]);

  const [weather, evidence] = await Promise.all([
    analyzeWeather(input.claimLocation, input.claimDate, vision),
    analyzeEvidence(input.claimEvent, input.claimLocation, input.claimDate),
  ]);

  const trust = calculateTrust(metadata, vision, weather, evidence);
  const aiSummary = await generateSummary(trust, metadata, vision, weather, evidence);

  return {
    metadata,
    vision,
    weather,
    evidence,
    trust,
    aiSummary,
  };
}
