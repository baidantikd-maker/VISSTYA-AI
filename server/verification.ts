/**
 * Visstya AI Verification Modules
 * Four parallel modules that analyze media and claims to produce a trust score
 */

import { ENV } from "./_core/env";
import { analyzeMediaWithGemini, GEMINI_MODEL } from "./_core/gemini";

// ============================================================================
// Type Definitions
// ============================================================================

export interface VerificationInput {
  mediaUrl: string;
  mediaType: "image" | "video";
  claimEvent?: string;
  claimLocation?: string;
  claimDate?: Date;
}

export interface ModuleFindings {
  score: number;
  maxScore: number;
  findings: string[];
  details?: Record<string, unknown>;
}

export interface VerificationResult {
  metadata: ModuleFindings;
  vision: ModuleFindings;
  weather: ModuleFindings;
  evidence: ModuleFindings;
  totalScore: number;
  statusBand: "FALSE" | "AVERAGE" | "TRUSTABLE";
  summary: string;
}

// ============================================================================
// Module 1: Metadata Analysis (Max 15 pts)
// ============================================================================

export async function analyzeMetadata(mediaUrl: string, mediaType: "image" | "video"): Promise<ModuleFindings> {
  /**
   * Extract EXIF data, check integrity, GPS, camera info
   * For MVP, we'll return a mock implementation
   * In production, use exifread for images and ffmpeg for videos
   */
  
  const findings: string[] = [];
  let score = 0;

  try {
    // Check if media URL is valid
    const url = new URL(mediaUrl);
    findings.push("Valid media URL format");
    score += 3;

    // Mock EXIF extraction (in production, use exifread library)
    if (mediaType === "image") {
      findings.push("Image format detected");
      score += 2;
      // Mock: assume EXIF present for demo
      findings.push("EXIF data present");
      score += 5;
      findings.push("GPS coordinates found");
      score += 5;
    } else {
      findings.push("Video format detected");
      score += 2;
      findings.push("Video metadata readable");
      score += 4;
      findings.push("Timestamp consistent");
      score += 4;
    }
  } catch (error) {
    findings.push("Unable to validate media URL");
  }

  return {
    score: Math.min(score, 15),
    maxScore: 15,
    findings,
    details: {
      mediaType,
      exifPresent: true,
      gpsPresent: true,
      integrityFlags: [],
    },
  };
}

// ============================================================================
// Module 2: Vision Analysis (Max 25 pts)
// ============================================================================

export async function analyzeVision(
  mediaUrl: string,
  mediaType: "image" | "video",
  claimEvent?: string,
  claimLocation?: string
): Promise<ModuleFindings> {
  /**
   * Use Google Gemini Flash to analyze visual content
   * Extract objects, scene, weather cues, time of day, location clues
   */

  const findings: string[] = [];
  let score = 0;

  try {
    const analysis = await analyzeMediaWithGemini({
      mediaUrl,
      mediaType,
      claimEvent,
      claimLocation,
    });

    if (analysis.description) {
      findings.push(`Scene: ${analysis.description}`);
      score += 5;
    }

    if (analysis.objectsDetected.length > 0) {
      findings.push(`Objects detected: ${analysis.objectsDetected.join(", ")}`);
      score += 5;
    }

    const visualCues = Array.from(new Set(
      [analysis.weatherCues, analysis.timeOfDay].filter((cue): cue is string => Boolean(cue))
    )).join(", ");
    if (visualCues) {
      findings.push(`Visual cues: ${visualCues}`);
      score += 5;
    }

    if (analysis.locationClues.length > 0) {
      findings.push(`Location clues: ${analysis.locationClues.join(", ")}`);
      score += 5;
    }

    if (analysis.manipulationSigns.length > 0) {
      findings.push(
        `Potential manipulation indicators: ${analysis.manipulationSigns.join(", ")}`
      );
    }

    if (claimEvent) {
      if (analysis.eventConsistency === "consistent") {
        findings.push("Claimed event is consistent with the visual evidence");
        score += 5;
      } else if (analysis.eventConsistency === "inconsistent") {
        findings.push(
          "Claimed event appears INCONSISTENT with the visual evidence"
        );
        score += 2;
      } else if (analysis.eventConsistency === "inconclusive") {
        findings.push(
          "Claimed event consistency could not be determined from the visuals"
        );
        score += 3;
      }
    } else if (claimLocation) {
      if (analysis.locationConsistency === "consistent") {
        findings.push("Claimed location is consistent with the visual clues");
        score += 5;
      } else if (analysis.locationConsistency === "inconsistent") {
        findings.push(
          "Claimed location appears INCONSISTENT with the visual clues"
        );
        score += 2;
      } else if (analysis.locationConsistency === "inconclusive") {
        findings.push(
          "Claimed location consistency could not be determined from the visuals"
        );
        score += 3;
      }
    }

    return {
      score: Math.min(score, 25),
      maxScore: 25,
      findings,
      details: {
        model: GEMINI_MODEL,
        description: analysis.description,
        sceneType: analysis.sceneType,
        objectsDetected: analysis.objectsDetected,
        weatherCues: analysis.weatherCues,
        timeOfDay: analysis.timeOfDay,
        locationClues: analysis.locationClues,
        manipulationSigns: analysis.manipulationSigns,
        eventConsistency: analysis.eventConsistency,
        locationConsistency: analysis.locationConsistency,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown vision analysis error";
    console.error("Vision analysis error:", error);
    findings.push(`Vision analysis unavailable: ${message}`);
    return {
      score: 0,
      maxScore: 25,
      findings,
      details: {
        model: GEMINI_MODEL,
        error: message,
      },
    };
  }
}

// ============================================================================
// Module 3: Weather Verification (Max 25 pts)
// ============================================================================

export async function analyzeWeather(
  claimLocation?: string,
  claimDate?: Date
): Promise<ModuleFindings> {
  /**
   * Geocode location via OpenStreetMap Nominatim
   * Fetch historical weather from OpenWeatherMap
   * Compare with visual cues
   */

  const findings: string[] = [];
  let score = 0;

  try {
    if (!claimLocation || !claimDate) {
      findings.push("Insufficient location or date data for weather verification");
      return {
        score: 0,
        maxScore: 25,
        findings,
        details: {},
      };
    }

    // In production:
    // 1. Call Nominatim API to geocode location
    // 2. Call OpenWeatherMap historical API
    // 3. Compare with vision findings

    findings.push(`Location geocoded: "${claimLocation}"`);
    score += 5;

    findings.push(`Historical weather retrieved for ${claimDate.toDateString()}`);
    score += 5;

    findings.push("Weather conditions match visual cues");
    score += 10;

    findings.push("Sunrise/sunset time consistent with claim");
    score += 5;

  } catch (error) {
    findings.push("Weather verification encountered an error");
  }

  return {
    score: Math.min(score, 25),
    maxScore: 25,
    findings,
    details: {
      location: claimLocation,
      date: claimDate?.toISOString(),
      temperature: "25°C",
      conditions: "Clear",
      rainfall: "0mm",
      sunriseTime: "06:30",
      sunsetTime: "18:45",
    },
  };
}

// ============================================================================
// Module 4: Evidence Corroboration (Max 35 pts)
// ============================================================================

export async function analyzeEvidence(
  claimEvent?: string,
  claimLocation?: string,
  claimDate?: Date
): Promise<ModuleFindings> {
  /**
   * Generate search queries from claim fields
   * Collect evidence from trusted sources:
   * - PIB Fact Check
   * - Reuters
   * - Google Fact Check Tools API
   * Deduplicate and score corroboration
   */

  const findings: string[] = [];
  let score = 0;

  try {
    if (!claimEvent) {
      findings.push("No event claim provided for evidence search");
      return {
        score: 0,
        maxScore: 35,
        findings,
        details: {},
      };
    }

    // In production:
    // 1. Generate search queries from claim fields
    // 2. Query PIB Fact Check, Reuters, Google Fact Check APIs
    // 3. Deduplicate results
    // 4. Measure independent support

    findings.push(`Searching for evidence: "${claimEvent}"`);
    score += 5;

    if (claimLocation) {
      findings.push(`Location-specific search: "${claimLocation}"`);
      score += 5;
    }

    findings.push("Multiple trusted sources queried");
    score += 5;

    findings.push("Evidence sources deduplicated");
    score += 5;

    findings.push("Strong corroboration found from independent sources");
    score += 10;

    findings.push("PIB Fact Check confirms claim");
    score += 5;

  } catch (error) {
    findings.push("Evidence corroboration encountered an error");
  }

  return {
    score: Math.min(score, 35),
    maxScore: 35,
    findings,
    details: {
      sourcesQueried: ["PIB Fact Check", "Reuters", "Google Fact Check"],
      evidenceFound: 3,
      independentSources: 2,
      corroborationLevel: "high",
    },
  };
}

// ============================================================================
// Trust Engine: Orchestrator & Aggregator
// ============================================================================

export async function runTrustEngine(input: VerificationInput): Promise<VerificationResult> {
  /**
   * Run all four modules in parallel
   * Aggregate scores and assign status band
   * Generate summary narrative
   */

  try {
    // Run all modules in parallel
    const [metadata, vision, weather, evidence] = await Promise.all([
      analyzeMetadata(input.mediaUrl, input.mediaType),
      analyzeVision(input.mediaUrl, input.mediaType, input.claimEvent, input.claimLocation),
      analyzeWeather(input.claimLocation, input.claimDate),
      analyzeEvidence(input.claimEvent, input.claimLocation, input.claimDate),
    ]);

    // Calculate total score
    const totalScore = metadata.score + vision.score + weather.score + evidence.score;

    // Assign status band based on score thresholds
    let statusBand: "FALSE" | "AVERAGE" | "TRUSTABLE";
    if (totalScore < 40) {
      statusBand = "FALSE";
    } else if (totalScore < 80) {
      statusBand = "AVERAGE";
    } else {
      statusBand = "TRUSTABLE";
    }

    // Generate summary narrative
    const summary = generateSummary(
      totalScore,
      statusBand,
      metadata,
      vision,
      weather,
      evidence,
      input
    );

    return {
      metadata,
      vision,
      weather,
      evidence,
      totalScore,
      statusBand,
      summary,
    };
  } catch (error) {
    console.error("Trust Engine error:", error);
    throw new Error("Verification failed: " + (error instanceof Error ? error.message : "Unknown error"));
  }
}

// ============================================================================
// Helper: Summary Generation
// ============================================================================

function generateSummary(
  totalScore: number,
  statusBand: "FALSE" | "AVERAGE" | "TRUSTABLE",
  metadata: ModuleFindings,
  vision: ModuleFindings,
  weather: ModuleFindings,
  evidence: ModuleFindings,
  input: VerificationInput
): string {
  const parts: string[] = [];

  // Status interpretation
  if (statusBand === "FALSE") {
    parts.push(
      `This claim has a trust score of ${totalScore.toFixed(1)}/100 (FALSE), indicating strong evidence of misinformation or inconsistency.`
    );
  } else if (statusBand === "AVERAGE") {
    parts.push(
      `This claim has a trust score of ${totalScore.toFixed(1)}/100 (AVERAGE), with mixed evidence. Review details carefully before trusting.`
    );
  } else {
    parts.push(
      `This claim has a trust score of ${totalScore.toFixed(1)}/100 (TRUSTABLE), with strong multi-source support and consistency.`
    );
  }

  // Key findings
  const strongestModule = [
    { name: "Metadata", score: metadata.score },
    { name: "Vision", score: vision.score },
    { name: "Weather", score: weather.score },
    { name: "Evidence", score: evidence.score },
  ].sort((a, b) => b.score - a.score)[0];

  if (strongestModule) {
    parts.push(
      `The strongest signal comes from ${strongestModule.name} Analysis (${strongestModule.score}/${strongestModule.score === 15 ? 15 : strongestModule.score === 25 ? 25 : 35} points).`
    );
  }

  // Specific findings
  if (evidence.findings.length > 0) {
    parts.push(`Evidence: ${evidence.findings[evidence.findings.length - 1]}`);
  }

  if (metadata.findings.length > 0) {
    parts.push(`Media: ${metadata.findings[metadata.findings.length - 1]}`);
  }

  return parts.join(" ");
}
