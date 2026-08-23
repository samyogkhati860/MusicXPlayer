// Single place that knows about environment variables.
// Put your key in a local .env file as VITE_YT_API_KEY=... (see .env.example).
export const YT_API_KEY = import.meta.env.VITE_YT_API_KEY || "";

console.log(
  "YouTube API key loaded:",
  Boolean(YT_API_KEY),
  YT_API_KEY ? YT_API_KEY.slice(0, 8) + "..." : "MISSING"
);

export const DEFAULT_QUERY = "sunkissed lofi citypop japanese";
export const YT_API_BASE = "https://www.googleapis.com/youtube/v3";