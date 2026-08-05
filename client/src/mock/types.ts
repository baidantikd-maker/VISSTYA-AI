export type StatusBand = "FALSE" | "AVERAGE" | "TRUSTABLE";

export type MediaKind = "image" | "video";

export interface MediaInfo {
  url: string;
  kind: MediaKind;
  fileName?: string;
  mime?: string;
  posterUrl?: string;
}

export interface ClaimContext {
  event: string;
  location?: string;
  date?: string;
}

export interface AnalysisItem {
  label: string;
  value: string;
  tone: "good" | "warn" | "bad" | "neutral";
}

export interface ModuleReport {
  score: number;
  max: number;
  summary: string;
  items: AnalysisItem[];
  redFlags?: string[];
}

export interface Source {
  id: string;
  name: string;
  domain: string;
  headline: string;
  publishedAt: string;
  label: "Supporting" | "Contradicting" | "Inconclusive";
  snippet: string;
  url: string;
}

export interface TimelineEvent {
  at: string;
  label: string;
  detail?: string;
}

export interface Limitation {
  title: string;
  detail: string;
}

export interface VerificationReport {
  id: number;
  shareToken: string;
  media: MediaInfo;
  claim: ClaimContext;
  totalScore: number;
  statusBand: StatusBand;
  summary: string;
  modules: {
    metadata: ModuleReport;
    vision: ModuleReport;
    weather: ModuleReport;
    evidence: ModuleReport;
  };
  sources: Source[];
  timeline: TimelineEvent[];
  limitations: Limitation[];
  createdAt: string;
}

export interface AnalysisInput {
  media: MediaInfo;
  claim: ClaimContext;
}
