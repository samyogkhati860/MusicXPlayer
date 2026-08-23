import React from "react";

export default function EqBars({ animate }) {
  return (
    <div className="flex items-end gap-[2px] h-4 w-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`w-[3px] bg-white rounded-full ${animate ? "animate-pulse" : ""}`}
          style={{
            height: `${6 + i * 3}px`,
            animationDuration: "0.9s",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}
