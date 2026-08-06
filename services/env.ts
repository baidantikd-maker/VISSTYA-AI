export const ENV = {
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-flash-latest",
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || "",
  forgeApiKey: process.env.FORGE_API_KEY || "",
  forgeApiUrl: process.env.FORGE_API_URL || "",
  newsApiKey: process.env.NEWS_API_KEY || "",
  newsApiUrl: process.env.NEWS_API_URL || "https://api.bing.microsoft.com/v7.0/news/search",
};
