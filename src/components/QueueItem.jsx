import React from "react";
import { MoreVertical } from "lucide-react";
import EqBars from "./EqBars.jsx";
import { formatTime } from "../utils/format.js";

export default function QueueItem({ track, active, isPlaying, isLast, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
      style={{
        background: active ? "rgba(255,255,255,0.15)" : "transparent",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <div className="w-5 flex justify-center shrink-0">{active && <EqBars animate={isPlaying} />}</div>
      <img src={track.thumb} alt="" className="w-11 h-11 rounded object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium truncate">{track.title}</div>
        <div className="text-white/70 text-xs truncate">{track.artist}</div>
      </div>
      <span className="text-white/70 text-xs shrink-0">{formatTime(track.duration)}</span>
      <MoreVertical className="text-white/70 shrink-0" size={16} />
    </button>
  );
}
