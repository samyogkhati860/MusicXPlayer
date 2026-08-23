import React from "react";

export default function Polaroid({ track }) {
  return (
    <div className="w-80 pt-3 px-3 pb-6 shadow-2xl" style={{ background: "#f3ede2", borderRadius: "2px" }}>
      <div className="relative w-full aspect-square overflow-hidden bg-slate-700">
        {track ? (
          <img src={track.thumb} alt={track.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/60 text-sm">
            Search for a song
          </div>
        )}
      </div>

      {track && (
        <div
          className="text-center pt-4 pb-1 px-2 text-slate-700 leading-tight"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          <div className="text-2xl truncate">{track.title}</div>
          <div className="text-xl text-slate-500 truncate">{track.artist}</div>
        </div>
      )}
    </div>
  );
}