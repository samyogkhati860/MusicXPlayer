// Single place that knows about environment variables.
// Put your key in a local .env file as VITE_YT_API_KEY=... (see .env.example).
export const YT_API_KEY = import.meta.env.VITE_YT_API_KEY || "";

export const DEFAULT_QUERY = "sunkissed lofi citypop japanese";

export const YT_API_BASE = "https://www.googleapis.com/youtube/v3";
