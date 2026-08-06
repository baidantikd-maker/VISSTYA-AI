export type MediaType = "image" | "video";

export type ClaimConsistency = "consistent" | "inconsistent" | "inconclusive";
export type TrustBand = "FALSE" | "AVERAGE" | "TRUSTABLE";

export interface VerificationInput {
  mediaUrl?: string;
  mediaType: MediaType;
  mediaBytes?: Uint8Array;
  mediaFilename?: string;
  claimEvent?: string;
  claimLocation?: string;
  claimDate?: Date;
}

export interface MetadataResult {
  mediaUrl: string | null;
  mediaType: MediaType;
  urlValid: boolean;
  mimeType: string | null;
  mimeMatch: boolean | null;
  hasExif: boolean;
  exifDate: string | null;
  camera: string | null;
  resolution: string | null;
  fileFormat: string | null;
  gpsCoordinates: { latitude: number; longitude: number } | null;
  issues: string[];
  warnings: string[];
  findings: string[];
  quality: number;
  details?: unknown;
}

export interface VisionResult {
  detectedObjects: string[];
  detectedScene: string;
  detectedWeather: string | null;
  estimatedTimeOfDay: string | null;
  visibleText: string[];
  confidence: number;
  claimConsistency: ClaimConsistency;
  explanation: string;
  findings: string[];
  details?: unknown;
}

export interface WeatherResult {
  claimLocation: string | null;
  claimDate: string | null;
  resolvedLocation: string | null;
  actualWeather: string | null;
  visualWeather: string | null;
  matchScore: number;
  isApplicable: boolean;
  explanation: string;
  findings: string[];
  details?: unknown;
}

export interface EvidenceResult {
  claimEvent: string | null;
  query: string;
  totalArticles: number;
  matchedTrustedSources: string[];
  supportingSources: Array<{ title: string; provider: string; url: string; publishedAt: string | null }>;
  conflictingSources: Array<{ title: string; provider: string; url: string; publishedAt: string | null }>;
  evidenceFound: boolean;
  verdict: "Supported" | "Partially Supported" | "Conflicting" | "No Evidence";
  confidence: number;
  explanation: string;
  findings: string[];
  details?: unknown;
}

export interface TrustResult {
  totalScore: number;
  trustBadge: TrustBand;
  moduleWeights: {
    metadata: number;
    vision: number;
    weather: number;
    evidence: number;
  };
  moduleScores: {
    metadata: number;
    vision: number;
    weather: number;
    evidence: number;
  };
  explanation: string;
}

export interface VerificationResponse {
  metadata: MetadataResult;
  vision: VisionResult;
  weather: WeatherResult;
  evidence: EvidenceResult;
  trust: TrustResult;
  aiSummary: string;
}
