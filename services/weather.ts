import { WeatherResult } from "./types.js";
import { ENV } from "./env.js";

const weatherKeywords = (text: string | null | undefined): string[] =>
  String(text || "")
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean);

const weatherCategories: Record<string, string[]> = {
  clear: ["clear", "sun", "sunny", "bright", "fair"],
  cloudy: ["cloud", "overcast", "grey", "gray", "cloudy", "partly cloudy"],
  rain: ["rain", "drizzle", "shower", "wet", "storm"],
  snow: ["snow", "blizzard", "sleet", "ice", "hail"],
  fog: ["fog", "mist", "haze", "smoke", "smog"],
  wind: ["wind", "windy", "breeze", "gust"],
};

const normalizeWeatherCategory = (text: string | null | undefined): string | null => {
  const terms = weatherKeywords(text);
  for (const [category, keywords] of Object.entries(weatherCategories)) {
    if (terms.some(term => keywords.includes(term))) return category;
  }
  return null;
};

const compareWeatherCues = (
  visualCues: string | null | undefined,
  actualWeather: string
): {
  match: boolean;
  matchedTerms: string[];
  score: number;
  visualCategory: string | null;
  actualCategory: string | null;
} => {
  const visualCategory = normalizeWeatherCategory(visualCues);
  const actualCategory = normalizeWeatherCategory(actualWeather);
  const matchedTerms = [] as string[];

  if (visualCategory && actualCategory && visualCategory === actualCategory) {
    matchedTerms.push(actualCategory);
  }

  const score = visualCategory && actualCategory ? (visualCategory === actualCategory ? 1 : 0) : 0;
  return { match: matchedTerms.length > 0, matchedTerms, score, visualCategory, actualCategory };
};

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const formatDate = (date: Date): string => date.toISOString().slice(0, 10);

export async function analyzeWeather(
  claimLocation?: string,
  claimDate?: Date,
  visionDetails?: any
): Promise<WeatherResult> {
  const findings: string[] = [];
  let matchScore = 0;
  let actualWeather: string | null = null;
  let visualWeather: string | null = null;
  let resolvedLocation: string | null = null;
  let explanation = "";

  const isIndoor =
    visionDetails?.sceneType?.toLowerCase().includes("indoor") ||
    visionDetails?.description?.toLowerCase().includes("indoor");
  const noWeatherCues =
    !visionDetails?.weatherCues ||
    visionDetails.weatherCues.toLowerCase().includes("none");

  if (isIndoor && noWeatherCues) {
    explanation = "Weather verification skipped because the scene is indoor and has no visible weather cues.";
    findings.push(explanation);
    return {
      claimLocation: claimLocation ?? null,
      claimDate: claimDate ? formatDate(claimDate) : null,
      resolvedLocation: null,
      actualWeather: null,
      visualWeather: null,
      matchScore: 1,
      isApplicable: false,
      explanation,
      findings,
      details: { reason: "Indoor scene" },
    };
  }

  if (!claimLocation || !claimDate) {
    explanation = "Weather verification could not run because location or date was missing.";
    findings.push(explanation);
    return {
      claimLocation: claimLocation ?? null,
      claimDate: claimDate ? formatDate(claimDate) : null,
      resolvedLocation: null,
      actualWeather: null,
      visualWeather: null,
      matchScore: 0,
      isApplicable: true,
      explanation,
      findings,
      details: {},
    };
  }

  findings.push(`Claimed location: ${claimLocation}`);
  findings.push(`Claimed date: ${formatDate(claimDate)}`);
  visualWeather = visionDetails?.weatherCues ?? null;

  if (!ENV.openWeatherApiKey) {
    explanation = "OpenWeather API key not configured; external weather lookup was skipped.";
    findings.push(explanation);
    return {
      claimLocation,
      claimDate: formatDate(claimDate),
      resolvedLocation: null,
      actualWeather: null,
      visualWeather,
      matchScore: 0,
      isApplicable: true,
      explanation,
      findings,
      details: { location: claimLocation, date: formatDate(claimDate) },
    };
  }

  try {
    const geocodeUrl = new URL("http://api.openweathermap.org/geo/1.0/direct");
    geocodeUrl.searchParams.set("q", claimLocation);
    geocodeUrl.searchParams.set("limit", "1");
    geocodeUrl.searchParams.set("appid", ENV.openWeatherApiKey);

    const geocodeResult = (await fetchJson(geocodeUrl.toString())) as Array<{
      lat?: number;
      lon?: number;
      name?: string;
      state?: string;
      country?: string;
    }>;

    if (geocodeResult.length === 0 || geocodeResult[0].lat == null || geocodeResult[0].lon == null) {
      explanation = "Could not resolve the claimed location with geocoding.";
      findings.push(explanation);
      return {
        claimLocation,
        claimDate: formatDate(claimDate),
        resolvedLocation: null,
        actualWeather: null,
        visualWeather,
        matchScore: 0,
        isApplicable: true,
        explanation,
        findings,
        details: { location: claimLocation, date: formatDate(claimDate) },
      };
    }

    const locationMetadata = geocodeResult[0];
    resolvedLocation = `${locationMetadata.name ?? claimLocation}${locationMetadata.country ? ", " + locationMetadata.country : ""}`;
    findings.push(`Resolved location to ${resolvedLocation}`);

    const timestamp = Math.floor(claimDate.getTime() / 1000);
    const weatherUrl = new URL("https://api.openweathermap.org/data/2.5/onecall/timemachine");
    weatherUrl.searchParams.set("lat", String(locationMetadata.lat));
    weatherUrl.searchParams.set("lon", String(locationMetadata.lon));
    weatherUrl.searchParams.set("dt", String(timestamp));
    weatherUrl.searchParams.set("appid", ENV.openWeatherApiKey);
    weatherUrl.searchParams.set("units", "metric");

    const weatherData = await fetchJson(weatherUrl.toString()) as {
      current?: { weather?: Array<{ description?: string }> };
      hourly?: Array<{ weather?: Array<{ description?: string }> }>;
    };

    actualWeather =
      weatherData.current?.weather?.[0]?.description ||
      weatherData.hourly?.[0]?.weather?.[0]?.description ||
      "unknown";
    findings.push(`Historical weather description: ${actualWeather}`);

    const comparison = compareWeatherCues(visualWeather, actualWeather);
    matchScore = comparison.score;

    if (comparison.match) {
      explanation = `Visual weather cues match the actual weather category (${comparison.visualCategory}).`;
      findings.push(explanation);
    } else if (comparison.visualCategory || comparison.actualCategory) {
      explanation = `Weather category mismatch: visual category ${comparison.visualCategory ?? "unknown"} vs actual category ${comparison.actualCategory ?? "unknown"}.`;
      findings.push(explanation);
    } else {
      explanation = `Could not classify weather cues strongly enough for a category comparison. Visual: ${visualWeather ?? "none"}; Actual: ${actualWeather}.`;
      findings.push(explanation);
    }

    return {
      claimLocation,
      claimDate: formatDate(claimDate),
      resolvedLocation,
      actualWeather,
      visualWeather,
      matchScore,
      isApplicable: true,
      explanation,
      findings,
      details: {
        resolvedLocation,
        actualWeather,
        visualWeather,
      },
    };
  } catch (error) {
    explanation = `Weather verification failed: ${error instanceof Error ? error.message : "unknown error"}`;
    findings.push(explanation);
    return {
      claimLocation,
      claimDate: formatDate(claimDate),
      resolvedLocation: null,
      actualWeather: null,
      visualWeather,
      matchScore: 0,
      isApplicable: true,
      explanation,
      findings,
      details: { location: claimLocation, date: formatDate(claimDate) },
    };
  }
}
