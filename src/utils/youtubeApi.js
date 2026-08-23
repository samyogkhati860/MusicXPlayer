import { YT_API_KEY, YT_API_BASE } from "../config.js";
import { parseISODuration } from "./format.js";

async function searchVideoIds(query, maxResults = 20) {
  const url = `${YT_API_BASE}/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(
    query
  )}&key=${YT_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return (data.items || []).map((it) => it.id.videoId).filter(Boolean);
}

async function fetchVideoDetails(ids) {
  if (ids.length === 0) return [];
  const url = `${YT_API_BASE}/videos?part=contentDetails,snippet&id=${ids.join(",")}&key=${YT_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return (data.items || []).map((item) => ({
    id: item.id,
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    thumb:
      item.snippet.thumbnails?.maxres?.url ||
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.medium?.url,
    duration: parseISODuration(item.contentDetails.duration),
  }));
}

// Search YouTube and return fully-formed track objects (with durations).
export async function searchTracks(query, maxResults = 20) {
  const ids = await searchVideoIds(query, maxResults);
  return fetchVideoDetails(ids);
}
export async function fetchPlaylistTracks(playlistId) {
  const url =
    `${YT_API_BASE}/playlistItems?part=snippet&maxResults=50` +
    `&playlistId=${encodeURIComponent(playlistId)}` +
    `&key=${YT_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  const ids = (data.items || [])
    .map((item) => item.snippet?.resourceId?.videoId)
    .filter(Boolean);

  return fetchVideoDetails(ids);
}