import React from "react";
import { ListMusic } from "lucide-react";
import QueueItem from "./QueueItem.jsx";

export default function Queue({ tracks, currentIndex, isPlaying, loading, onPlayTrack, onArtistClick }) {
  return (
    <div className="w-full mt-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-white text-lg font-medium">Queue</span>
        <ListMusic className="text-white/90" size={20} />
      </div>

      <div
        className="w-full rounded-2xl overflow-y-auto backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.12)", maxHeight: "22rem" }}
      >
        {tracks.map((t, i) => (
          <QueueItem
            key={t.id}
            track={t}
            active={i === currentIndex}
            isPlaying={isPlaying}
            isLast={i === tracks.length - 1}
            onClick={() => onPlayTrack(i)}
            onArtistClick={onArtistClick}
          />
        ))}
        {tracks.length === 0 && !loading && (
          <div className="text-white/70 text-sm text-center py-6">No tracks yet — try searching.</div>
        )}
      </div>
    </div>
  );
}