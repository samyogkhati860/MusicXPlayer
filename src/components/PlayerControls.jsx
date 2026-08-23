import React from "react";
import { SkipBack, SkipForward, Play, Pause } from "lucide-react";

export default function PlayerControls({ isPlaying, onPrev, onPlayPause, onNext }) {
  return (
    <div className="flex items-center gap-8">
      <button onClick={onPrev} className="text-white/90 hover:text-white transition">
        <SkipBack fill="currentColor" size={26} />
      </button>
      <button
        onClick={onPlayPause}
        className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:scale-105 transition"
      >
        {isPlaying ? (
          <Pause fill="#333" color="#333" size={28} />
        ) : (
          <Play fill="#333" color="#333" size={28} style={{ marginLeft: 2 }} />
        )}
      </button>
      <button onClick={onNext} className="text-white/90 hover:text-white transition">
        <SkipForward fill="currentColor" size={26} />
      </button>
    </div>
  );
}
