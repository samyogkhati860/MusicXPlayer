import React, { useState } from "react";
import { Search, Loader2, ListPlus, X } from "lucide-react";

export default function SearchBar({
  onSearch,
  onPlaylistLoad,
  loading,
}) {
  const [query, setQuery] = useState("");
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistError, setPlaylistError] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handlePlaylistLoad = async (e) => {
    e.preventDefault();

    if (!playlistUrl.trim()) return;

    setPlaylistLoading(true);
    setPlaylistError("");

    try {
      await onPlaylistLoad(playlistUrl);
      setPlaylistUrl("");
      setPlaylistOpen(false);
    } catch (err) {
      setPlaylistError(err.message || "Couldn't load playlist.");
    } finally {
      setPlaylistLoading(false);
    }
  };

  return (
    <>
      <form
        className="w-full flex items-center gap-3 rounded-full px-5 py-3 backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.22)" }}
        onSubmit={handleSearch}
      >
        {loading ? (
          <Loader2
            className="text-white/80 animate-spin shrink-0"
            size={20}
          />
        ) : (
          <Search
            className="text-white/80 shrink-0"
            size={20}
          />
        )}

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="bg-transparent outline-none border-none flex-1 text-white placeholder-white/70 text-lg min-w-0"
        />

        <button
          type="button"
          onClick={() => {
            setPlaylistOpen(true);
            setPlaylistError("");
          }}
          className="text-white/80 hover:text-white transition shrink-0"
          title="Load YouTube playlist"
        >
          <ListPlus size={20} />
        </button>
      </form>

      {playlistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setPlaylistOpen(false)}
          />

          <div
            className="relative w-full max-w-sm rounded-2xl p-5 shadow-2xl backdrop-blur-xl"
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <button
              type="button"
              onClick={() => setPlaylistOpen(false)}
              className="absolute top-3 right-3 text-white/60 hover:text-white transition"
            >
              <X size={18} />
            </button>

            <div className="text-white text-lg font-medium mb-1">
              Load YouTube Playlist
            </div>

            <div className="text-white/60 text-xs mb-4">
              Paste a YouTube playlist URL
            </div>

            <form onSubmit={handlePlaylistLoad}>
              <input
                autoFocus
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="https://youtube.com/playlist?list=..."
                className="w-full rounded-xl px-4 py-3 bg-black/20 border border-white/10 outline-none text-white placeholder-white/40 text-sm"
              />

              {playlistError && (
                <div className="text-red-200 text-xs mt-2">
                  {playlistError}
                </div>
              )}

              <button
                type="submit"
                disabled={playlistLoading || !playlistUrl.trim()}
                className="w-full mt-4 rounded-xl py-2.5 bg-white text-slate-800 text-sm font-medium hover:scale-[1.01] transition disabled:opacity-50"
              >
                {playlistLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Loading playlist...
                  </span>
                ) : (
                  "Load Playlist"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}