import React, { useEffect, useState } from "react";
import { Bookmark, Trash2, Pencil, Check, X } from "lucide-react";

const STORAGE_KEY = "musicxplayer_saved_playlists";

export default function SavedPlaylists({ tracks, onLoadPlaylist }) {
  const [playlists, setPlaylists] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      setPlaylists(saved);
    } catch {
      setPlaylists([]);
    }
  }, []);

  const saveCurrentQueue = () => {
    if (!tracks || tracks.length === 0) return;

    const firstTrack = tracks[0];

    const playlist = {
      id: crypto.randomUUID(),
      name: `Playlist ${playlists.length + 1}`,
      tracks,
      cover: firstTrack?.thumb || "",
    };

    const updated = [...playlists, playlist];

    setPlaylists(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deletePlaylist = (id) => {
    const updated = playlists.filter(
      (playlist) => playlist.id !== id
    );

    setPlaylists(updated);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    if (editingId === id) {
      setEditingId(null);
      setEditName("");
    }
  };

  const startRename = (playlist) => {
    setEditingId(playlist.id);
    setEditName(playlist.name);
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveRename = (id) => {
    const trimmedName = editName.trim();

    if (!trimmedName) return;

    const updated = playlists.map((playlist) =>
      playlist.id === id
        ? { ...playlist, name: trimmedName }
        : playlist
    );

    setPlaylists(updated);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    setEditingId(null);
    setEditName("");
  };

  const loadPlaylist = (playlist) => {
    if (editingId === playlist.id) return;

    onLoadPlaylist(playlist.tracks);
  };

  return (
    <div className="w-full mt-1">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-white text-lg font-medium">
            Saved Playlists
          </span>

          <Bookmark
            className="text-white/80"
            size={18}
          />
        </div>

        <button
          onClick={saveCurrentQueue}
          disabled={!tracks || tracks.length === 0}
          className="text-white/70 hover:text-white text-xs transition disabled:opacity-30"
        >
          + Save queue
        </button>
      </div>

      {playlists.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="relative shrink-0 w-32 rounded-xl overflow-hidden cursor-pointer backdrop-blur-md transition hover:scale-[1.02]"
              style={{
                background: "rgba(255,255,255,0.13)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
              onClick={() => loadPlaylist(playlist)}
            >
              <div className="w-full aspect-square bg-black/20">
                {playlist.cover ? (
                  <img
                    src={playlist.cover}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Bookmark
                      className="text-white/30"
                      size={28}
                    />
                  </div>
                )}
              </div>

              <div className="px-3 py-2.5">
                {editingId === playlist.id ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1"
                  >
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) =>
                        setEditName(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveRename(playlist.id);
                        }

                        if (e.key === "Escape") {
                          cancelRename();
                        }
                      }}
                      className="w-full min-w-0 bg-black/20 rounded px-1.5 py-1 text-white text-xs outline-none border border-white/20"
                    />

                    <button
                      onClick={() =>
                        saveRename(playlist.id)
                      }
                      className="text-white/70 hover:text-white"
                    >
                      <Check size={14} />
                    </button>

                    <button
                      onClick={cancelRename}
                      className="text-white/50 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-white text-sm font-medium truncate pr-1">
                      {playlist.name}
                    </div>

                    <div className="text-white/55 text-xs mt-0.5">
                      {playlist.tracks.length} songs
                    </div>
                  </>
                )}
              </div>

              {/* Rename button */}
              {editingId !== playlist.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startRename(playlist);
                  }}
                  className="absolute top-2 right-9 w-7 h-7 rounded-full flex items-center justify-center bg-black/30 text-white/60 hover:text-white hover:bg-black/50 transition"
                  title="Rename playlist"
                >
                  <Pencil size={13} />
                </button>
              )}

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePlaylist(playlist.id);
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center bg-black/30 text-white/60 hover:text-white hover:bg-black/50 transition"
                title="Delete playlist"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="w-full rounded-xl px-4 py-4 text-center backdrop-blur-md"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="text-white/50 text-sm">
            Your saved playlists will appear here.
          </div>
        </div>
      )}
    </div>
  );
}