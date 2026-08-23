import { useCallback, useState } from "react";
import { searchTracks } from "../utils/youtubeApi.js";

// Owns the search query lifecycle: loading / error / results.
// Returns { tracks, setTracks, loading, error, runSearch }.
export function useYouTubeSearch() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runSearch = useCallback(async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const results = await searchTracks(query);
      if (results.length === 0) {
        setError("No results found.");
      } else {
        setTracks(results);
      }
    } catch (e) {
      setError(e.message || "Something went wrong talking to YouTube.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { tracks, setTracks, loading, error, runSearch };
}
