import { EvidenceResult } from "./types.js";
import { ENV } from "./env.js";

const fetchJson = async (url: string, headers: Record<string, string> = {}) => {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const buildSearchQuery = (
  claimEvent: string,
  claimLocation?: string,
  claimDate?: Date
) => {
  const parts = [claimEvent.trim()];
  if (claimLocation) parts.push(claimLocation.trim());
  if (claimDate) parts.push(claimDate.toISOString().slice(0, 10));
  return parts.filter(Boolean).join(" ");
};

const trustedSources = [
  "reuters",
  "ap news",
  "bbc",
  "associated press",
  "afp",
  "the guardian",
  "al jazeera",
  "cnn",
];

const normalizeText = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length === 0 ? null : text;
};

const extractProviders = (items: Array<any>): string[] =>
  items
    .flatMap(item => {
      if (item == null) return [];
      const providers: string[] = [];

      const rawProvider = item.provider ?? item.source ?? item.
        providerName ?? item.sourceName;
      if (Array.isArray(rawProvider)) {
        rawProvider.forEach((provider: any) => {
          const normalized = normalizeText(provider);
          if (normalized) providers.push(normalized);
        });
      } else {
        const normalized = normalizeText(rawProvider);
        if (normalized) providers.push(normalized);
      }

      const articleSource = normalizeText(item.source?.name ?? item.source);
      if (articleSource) providers.push(articleSource);

      const articleProvider = normalizeText(item.provider?.name ?? item.provider?.value);
      if (articleProvider) providers.push(articleProvider);

      return providers;
    })
    .map(provider => provider.trim())
    .filter(Boolean);

const extractArticles = (result: any): Array<any> => {
  if (Array.isArray(result.value)) return result.value;
  if (Array.isArray(result.articles)) return result.articles;
  if (Array.isArray(result.news)) return result.news;
  return [];
};

const extractPublishedAt = (item: any): string | null => {
  const published = normalizeText(
    item.publishedAt ?? item.datePublished ?? item.published ?? item.datetime
  );
  if (!published) return null;
  const parsed = new Date(published);
  if (Number.isNaN(parsed.getTime())) return published;
  return parsed.toISOString();
};

const buildArticleSummary = (item: any) => {
  const title = normalizeText(item.name ?? item.title ?? item.headline) ?? "Untitled article";
  const provider = normalizeText(item.provider?.name ?? item.source?.name ?? item.source ?? item.provider) ?? "Unknown source";
  const url = normalizeText(item.url ?? item.link ?? item.webUrl) ?? "";
  const publishedAt = extractPublishedAt(item);
  return { title, provider, url, publishedAt };
};

const classifyArticle = (item: any, query: string): "support" | "conflict" | "neutral" => {
  const text = [item.name, item.title, item.description, item.snippet, item.headline]
    .filter(Boolean)
    .map(String)
    .join(" ")
    .toLowerCase();

  const conflictKeywords = [
    "conflict",
    "contradict",
    "deny",
    "dispute",
    "fake",
    "hoax",
    "false",
    "unrelated",
    "not true",
  ];
  const supportKeywords = [
    "confirmed",
    "reported",
    "said",
    "according to",
    "claimed",
    "supports",
  ];

  if (conflictKeywords.some(keyword => text.includes(keyword))) {
    return "conflict";
  }
  if (supportKeywords.some(keyword => text.includes(keyword))) {
    return "support";
  }
  return "neutral";
};

export async function analyzeEvidence(
  claimEvent?: string,
  claimLocation?: string,
  claimDate?: Date
): Promise<EvidenceResult> {
  const findings: string[] = [];
  let confidence = 0;
  let matchedTrustedSources: string[] = [];
  let totalArticles = 0;
  let evidenceFound = false;
  const supportingSources: Array<{ title: string; provider: string; url: string; publishedAt: string | null }> = [];
  const conflictingSources: Array<{ title: string; provider: string; url: string; publishedAt: string | null }> = [];

  if (!claimEvent) {
    const explanation = "No event claim provided for evidence corroboration.";
    findings.push(explanation);
    return {
      claimEvent: null,
      query: "",
      totalArticles: 0,
      matchedTrustedSources,
      supportingSources,
      conflictingSources,
      evidenceFound,
      verdict: "No Evidence",
      confidence,
      explanation,
      findings,
      details: {},
    };
  }

  findings.push(`Claimed event: ${claimEvent}`);
  confidence += 0.05;

  const query = buildSearchQuery(claimEvent, claimLocation, claimDate);
  findings.push(`Evidence search query: ${query}`);
  confidence += claimLocation || claimDate ? 0.1 : 0.05;

  if (!ENV.newsApiKey || !ENV.newsApiUrl) {
    const explanation =
      "News API key or endpoint not configured; evidence corroboration is limited.";
    findings.push(explanation);

    return {
      claimEvent,
      query,
      totalArticles,
      matchedTrustedSources,
      supportingSources,
      conflictingSources,
      evidenceFound,
      verdict: "No Evidence",
      confidence: Math.min(1, confidence),
      explanation,
      findings,
      details: { provider: "none", query },
    };
  }

  try {
    const url = new URL(ENV.newsApiUrl);
    url.searchParams.set("q", query);
    if (!url.searchParams.has("count")) {
      url.searchParams.set("count", "10");
    }

    const headers: Record<string, string> = {
      "Ocp-Apim-Subscription-Key": ENV.newsApiKey,
    };

    const result = await fetchJson(url.toString(), headers);
    const articles = extractArticles(result);
    totalArticles = articles.length;
    findings.push(`News search returned ${totalArticles} articles.`);
    confidence += totalArticles > 0 ? 0.2 : 0;

    const providers = extractProviders(articles);
    matchedTrustedSources = providers.filter(provider =>
      trustedSources.some(source => provider.toLowerCase().includes(source))
    );

    const scoredArticles = articles.map((article: any) => {
      const summary = buildArticleSummary(article);
      const category = classifyArticle(article, query);
      return { article: summary, category };
    });

    for (const { article, category } of scoredArticles) {
      if (category === "support") {
        supportingSources.push(article);
      }
      if (category === "conflict") {
        conflictingSources.push(article);
      }
    }

    if (matchedTrustedSources.length > 0) {
      evidenceFound = true;
      findings.push(
        `Trusted coverage found from: ${[...new Set(matchedTrustedSources)].join(", ")}`
      );
      confidence += 0.35;
    } else if (articles.length > 0) {
      evidenceFound = true;
      findings.push(
        "Coverage was found, but trusted sources were not clearly identified."
      );
      confidence += 0.15;
    } else {
      findings.push("No relevant coverage found for the claimed event.");
    }

    const verdict = conflictingSources.length > 0
      ? "Conflicting"
      : evidenceFound
      ? matchedTrustedSources.length > 0
        ? "Supported"
        : "Partially Supported"
      : "No Evidence";

    const explanation = conflictingSources.length > 0
      ? "Some sources appear to conflict with the claim, while other coverage may still be present."
      : evidenceFound
      ? "Evidence corroboration found coverage relevant to the claim."
      : "Evidence corroboration did not find clear support for the claim.";

    return {
      claimEvent,
      query,
      totalArticles,
      matchedTrustedSources: [...new Set(matchedTrustedSources)],
      supportingSources,
      conflictingSources,
      evidenceFound,
      verdict,
      confidence: Math.min(1, confidence),
      explanation,
      findings,
      details: { query, totalArticles, matchedTrustedSources, supportingSources, conflictingSources },
    };
  } catch (error) {
    const explanation =
      `Evidence search failed: ${error instanceof Error ? error.message : "unknown error"}`;
    findings.push(explanation);
    return {
      claimEvent,
      query,
      totalArticles,
      matchedTrustedSources,
      supportingSources,
      conflictingSources,
      evidenceFound,
      verdict: "No Evidence",
      confidence: Math.min(1, confidence),
      explanation,
      findings,
      details: { query },
    };
  }
}
