import React from "react";
import { ListPlus, Trash2 } from "lucide-react";

export default function PlaylistBar({ playlists, onSaveCurrentQueue, onDeletePlaylist, onLoadCustomPlaylist, canSave }) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex items-center justify-between px-1">
        <span className="text-white/80 text-sm">My Playlists</span>
        <button
          onClick={onSaveCurrentQueue}
          disabled={!canSave}
          className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition disabled:opacity-40"
        >
          <ListPlus size={14} />
          Save current queue
        </button>
      </div>

      {playlists.length > 0 && (
        <div className="w-full flex flex-wrap gap-2 px-1">
          {playlists.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-1.5 rounded-full pl-3 pr-1.5 py-1 text-xs text-white"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <button onClick={() => onLoadCustomPlaylist(p)} className="hover:underline">
                {p.name} ({p.tracks.length})
              </button>
              <button onClick={() => onDeletePlaylist(p.id)} className="text-white/60 hover:text-white p-0.5">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}