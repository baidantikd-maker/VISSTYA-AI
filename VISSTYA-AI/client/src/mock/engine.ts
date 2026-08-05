import { mockStore } from "./store";
import type {
  AnalysisInput,
  ModuleReport,
  StatusBand,
  VerificationReport,
} from "./types";

export interface ProcessingStep {
  key: string;
  label: string;
  detail: string;
}

export const PROCESSING_STEPS: ProcessingStep[] = [
  { key: "received", label: "Media received", detail: "File validated and normalized" },
  { key: "metadata", label: "Metadata extracted", detail: "EXIF, location and provenance" },
  { key: "vision", label: "Vision analysis", detail: "Scene, objects and editing artifacts" },
  { key: "weather", label: "Weather verification", detail: "Conditions cross-checked against records" },
  { key: "evidence", label: "Evidence corroboration", detail: "Dated sources matched and read" },
  { key: "trust", label: "Trust engine", detail: "Scores combined into a verdict" },
];

type Template = "TRUSTABLE" | "AVERAGE" | "FALSE";

const VERDICTS: Array<{ band: Template; total: number; weight: number }> = [
  { band: "TRUSTABLE", total: 84, weight: 45 },
  { band: "AVERAGE", total: 61, weight: 30 },
  { band: "FALSE", total: 26, weight: 25 },
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pickTemplate(input: AnalysisInput): { band: Template; total: number } {
  const h = hashString(`${input.claim.event}|${input.claim.location}`);
  const sum = VERDICTS.reduce((a, v) => a + v.weight, 0);
  let roll = h % sum;
  for (const v of VERDICTS) {
    if (roll < v.weight) return { band: v.band, total: v.total };
    roll -= v.weight;
  }
  return { band: "TRUSTABLE", total: 84 };
}

const OUTLETS = [
  ["Press Trust of India", "ptinews.com"],
  ["The Hindu", "thehindu.com"],
  ["Reuters", "reuters.com"],
  ["India Meteorological Department", "mausam.imd.gov.in"],
  ["The Weather Channel", "weather.com"],
  ["ANI", "aninews.in"],
  ["Indian Express", "indianexpress.com"],
  ["BBC News", "bbc.com"],
] as const;

function rand<T>(arr: readonly T[], seed: number): T {
  return arr[seed % arr.length];
}

function buildModule(
  score: number,
  max: number,
  items: ModuleReport["items"],
  summary: string,
  redFlags?: string[]
): ModuleReport {
  return { score, max, summary, items, redFlags };
}

function baseUrl(domain: string, claim: string): string {
  const slug = claim.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
  return `https://${domain}/report/${slug}`;
}

export function generateReport(input: AnalysisInput): VerificationReport {
  const { band, total } = pickTemplate(input);
  const seed = hashString(input.claim.event + total);
  const media =
    input.media.kind === "video"
      ? input.media
      : {
          ...input.media,
          url:
            input.media.url && !input.media.url.startsWith("blob:")
              ? input.media.url
              : `https://picsum.photos/seed/${seed % 9973}/1200/800`,
        };

  const claimText = input.claim.event;
  const location = input.claim.location ?? "Unspecified location";
  const date = input.claim.date ?? "Recent";

  let modules: VerificationReport["modules"];
  let summary: string;
  let sources: VerificationReport["sources"];
  let timeline: VerificationReport["timeline"];
  let limitations: VerificationReport["limitations"];

  if (band === "TRUSTABLE") {
    summary = `Independent, dated reporting is consistent with the claim that ${claimText.toLowerCase()}. Weather records, official statements and multiple news outlets corroborate the media and context provided. No contradicting evidence was found during analysis.`;
    modules = {
      metadata: buildModule(
        13,
        15,
        [
          { label: "Capture metadata", value: "Intact and internally consistent", tone: "good" },
          { label: "Location", value: "Matches claimed area", tone: "good" },
          { label: "Editing history", value: "Light adjustments, no cloning", tone: "good" },
        ],
        "Metadata supports the claimed time and place.",
        ["Media was re-encoded once during forwarding"]
      ),
      vision: buildModule(
        21,
        25,
        [
          { label: "Scene consistency", value: "Matches stated context", tone: "good" },
          { label: "Generation artifacts", value: "None found", tone: "good" },
          { label: "Perspective", value: "Single continuous capture", tone: "good" },
        ],
        "Visual analysis found no signs of manipulation or generation."
      ),
      weather: buildModule(
        23,
        25,
        [
          { label: "Weather records", value: "Consistent with the claim", tone: "good" },
          { label: "Official advisories", value: "Active on the claimed date", tone: "good" },
          { label: "Unusual anomalies", value: "None", tone: "good" },
        ],
        "Observational records align with the conditions shown."
      ),
      evidence: buildModule(
        27,
        35,
        [
          { label: "Independent sources", value: "Multiple corroborate", tone: "good" },
          { label: "First corroboration", value: "Within hours of the event", tone: "good" },
          { label: "Contradicting sources", value: "None found", tone: "good" },
        ],
        "Dated reporting from several outlets corroborates the claim.",
        ["Corroboration clusters around a small number of wire stories"]
      ),
    };
    sources = [
      {
        id: "g1",
        name: rand(OUTLETS, seed)[0],
        domain: rand(OUTLETS, seed)[1],
        headline: `${claimText.replace(/^./, (c) => c.toUpperCase())}: officials confirm`,
        publishedAt: new Date().toISOString(),
        label: "Supporting",
        snippet: `Local officials and reporting confirm the situation described in ${location}.`,
        url: baseUrl(rand(OUTLETS, seed)[1], claimText),
      },
      {
        id: "g2",
        name: rand(OUTLETS, seed + 3)[0],
        domain: rand(OUTLETS, seed + 3)[1],
        headline: `What we know about the events around ${date}`,
        publishedAt: new Date(Date.now() - 3600_000).toISOString(),
        label: "Supporting",
        snippet: "Independent reporters on the ground describe conditions matching the shared media.",
        url: baseUrl(rand(OUTLETS, seed + 3)[1], claimText),
      },
      {
        id: "g3",
        name: rand(OUTLETS, seed + 7)[0],
        domain: rand(OUTLETS, seed + 7)[1],
        headline: `Weather data supports reports of ${claimText.toLowerCase()}`,
        publishedAt: new Date(Date.now() - 7200_000).toISOString(),
        label: "Supporting",
        snippet: "Observational data from the claimed date is consistent with the description.",
        url: baseUrl(rand(OUTLETS, seed + 7)[1], claimText),
      },
    ];
    limitations = [
      { title: "Scope of analysis", detail: "This report assesses publicly available evidence; it is not an on-the-ground investigation." },
      { title: "Media provenance", detail: "The forwarded copy could not be traced to the original uploader." },
      { title: "Not a judgment of truth", detail: "The score rates how well evidence supports the claim. New evidence can change the outcome." },
    ];
  } else if (band === "AVERAGE") {
    summary = `The claim that ${claimText.toLowerCase()} is only partially supported. Some elements are consistent with records and local reporting, while key details — especially the attached media — do not fully match the evidence. A specific event may have occurred, but the claim as stated overstates it.`;
    modules = {
      metadata: buildModule(
        8,
        15,
        [
          { label: "Capture metadata", value: "Partially stripped", tone: "warn" },
          { label: "Location", value: "Broadly consistent", tone: "neutral" },
          { label: "Earliest circulation", value: "Predates the claimed date", tone: "bad" },
        ],
        "Metadata is incomplete and the earliest known copy does not match the claimed date.",
        ["Earliest circulating copy predates the event"]
      ),
      vision: buildModule(
        15,
        25,
        [
          { label: "Scene consistency", value: "Partially matches", tone: "warn" },
          { label: "Generation artifacts", value: "None found", tone: "good" },
          { label: "Detail cues", value: "Do not resolve the date", tone: "warn" },
        ],
        "Visuals are plausible but cannot be independently dated."
      ),
      weather: buildModule(
        16,
        25,
        [
          { label: "Weather records", value: "Partially consistent", tone: "warn" },
          { label: "Advisories", value: "Weak or absent", tone: "warn" },
        ],
        "Records partially support the claim but are not decisive."
      ),
      evidence: buildModule(
        22,
        35,
        [
          { label: "Independent sources", value: "Mixed", tone: "warn" },
          { label: "Contradicting sources", value: "Some found", tone: "warn" },
          { label: "Media match", value: "Fails to match any report", tone: "bad" },
        ],
        "Evidence is mixed: part of the claim is corroborated, part is contradicted.",
        ["Attached media does not match reporting from the event"]
      ),
    };
    sources = [
      {
        id: "g1",
        name: rand(OUTLETS, seed)[0],
        domain: rand(OUTLETS, seed)[1],
        headline: `Smaller event reported in ${location}; details differ`,
        publishedAt: new Date().toISOString(),
        label: "Inconclusive",
        snippet: "Local reporting describes an event, but the scale and timing differ from the claim.",
        url: baseUrl(rand(OUTLETS, seed)[1], claimText),
      },
      {
        id: "g2",
        name: rand(OUTLETS, seed + 5)[0],
        domain: rand(OUTLETS, seed + 5)[1],
        headline: `Earlier footage of a similar event resurfaces`,
        publishedAt: new Date(Date.now() - 1800_000).toISOString(),
        label: "Contradicting",
        snippet: "The circulating media appears to be from an earlier, similar event.",
        url: baseUrl(rand(OUTLETS, seed + 5)[1], claimText),
      },
    ];
    limitations = [
      { title: "Mixed evidence", detail: "Part of the claim is corroborated and part is not; the score reflects that balance." },
      { title: "Media dating", detail: "The media could not be reliably dated." },
      { title: "Not a judgment of truth", detail: "The score rates evidence support, not whether the event happened." },
    ];
  } else {
    summary = `No credible evidence supports the claim that ${claimText.toLowerCase()}. Records, official statements and dated reporting contradict the claim, and the attached media predates the claimed event. The claim as stated is not supported by the available evidence.`;
    modules = {
      metadata: buildModule(
        4,
        15,
        [
          { label: "Capture metadata", value: "Stripped", tone: "bad" },
          { label: "First seen online", value: "Well before the claimed date", tone: "bad" },
          { label: "Claimed date", value: "Not supported", tone: "bad" },
        ],
        "The media predates the claimed event.",
        ["Provenance contradicts the claimed date"]
      ),
      vision: buildModule(
        7,
        25,
        [
          { label: "Scene", value: "Unrelated to the claim", tone: "bad" },
          { label: "Dating cues", value: "Absent or misleading", tone: "bad" },
          { label: "Archive match", value: "Matches older footage", tone: "bad" },
        ],
        "Visuals do not depict the claimed event."
      ),
      weather: buildModule(
        5,
        25,
        [
          { label: "Weather records", value: "No matching conditions", tone: "bad" },
          { label: "Advisories", value: "None issued", tone: "bad" },
        ],
        "Observational records contradict the claimed conditions."
      ),
      evidence: buildModule(
        10,
        35,
        [
          { label: "Independent sources", value: "None corroborate", tone: "bad" },
          { label: "Contradicting sources", value: "Multiple", tone: "bad" },
          { label: "Official statements", value: "Deny the claim", tone: "bad" },
        ],
        "Every independent source found contradicts the claim.",
        ["Same media has been recirculated in earlier, debunked posts"]
      ),
    };
    sources = [
      {
        id: "g1",
        name: rand(OUTLETS, seed + 2)[0],
        domain: rand(OUTLETS, seed + 2)[1],
        headline: `No evidence of the claimed event in ${location}`,
        publishedAt: new Date().toISOString(),
        label: "Contradicting",
        snippet: "Official and journalistic accounts found no basis for the claim on the stated date.",
        url: baseUrl(rand(OUTLETS, seed + 2)[1], claimText),
      },
      {
        id: "g2",
        name: rand(OUTLETS, seed + 9)[0],
        domain: rand(OUTLETS, seed + 9)[1],
        headline: "Old media recycled as new",
        publishedAt: new Date(Date.now() - 3600_000).toISOString(),
        label: "Contradicting",
        snippet: "The circulating media was first published more than a year before the claimed event.",
        url: baseUrl(rand(OUTLETS, seed + 9)[1], claimText),
      },
      {
        id: "g3",
        name: rand(OUTLETS, seed + 11)[0],
        domain: rand(OUTLETS, seed + 11)[1],
        headline: "Fact-check: claim is not supported by evidence",
        publishedAt: new Date(Date.now() - 7200_000).toISOString(),
        label: "Contradicting",
        snippet: "A verification found no source, record or official statement backing the claim.",
        url: baseUrl(rand(OUTLETS, seed + 11)[1], claimText),
      },
    ];
    limitations = [
      { title: "Archive coverage", detail: "Reverse and archive searches covered a limited set of sources." },
      { title: "Not a judgment of truth", detail: "The media may be real footage — the claim's framing and date are what is unsupported." },
      { title: "New evidence", detail: "If new evidence emerges, re-running analysis can change this verdict." },
    ];
  }

  const now = Date.now();
  timeline = [
    { at: new Date(now - 43_200_000).toISOString(), label: "Media first shared online", detail: "Circulation begins in messaging groups" },
    { at: new Date(now - 28_800_000).toISOString(), label: "Initial reports published", detail: "First independent coverage appears" },
    { at: new Date(now - 14_400_000).toISOString(), label: "Verification underway", detail: "Visstya begins evidence gathering" },
    { at: new Date(now).toISOString(), label: "Report generated", detail: "Trust engine completes analysis" },
  ];

  const report: VerificationReport = {
    id: Date.now(),
    shareToken: Math.random().toString(36).slice(2, 12),
    media,
    claim: { event: input.claim.event, location: input.claim.location, date: input.claim.date },
    totalScore: total,
    statusBand: band as StatusBand,
    summary,
    modules,
    sources,
    timeline,
    limitations,
    createdAt: new Date(now).toISOString(),
  };

  return mockStore.create(report);
}
