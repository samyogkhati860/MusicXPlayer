import React from "react";
import { formatTime } from "../utils/format.js";
export default function ProgressBar({ currentTime, duration, onSeek }) {
  const pct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-1 px-1">
      <input
        type="range"
        min="0"
        max="100"
        value={pct || 0}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="w-full accent-white"
        style={{ height: 4 }}
      />
      <div className="flex items-center justify-between text-xs text-white/70 px-0.5">
  <span>{formatTime(currentTime)}</span>
  <span>{formatTime(duration)}</span>
</div>
    </div>
    
  );
}
