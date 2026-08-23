import React from "react";

export default function Background({ imageUrl }) {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : "linear-gradient(135deg, #d98a8a, #6b7686)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(45px) saturate(1.3) brightness(0.85)",
          transform: "scale(1.3)",
          transition: "background-image 0.6s ease",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(60,70,85,0.35) 0%, rgba(90,60,70,0.25) 50%, rgba(40,45,55,0.45) 100%)",
        }}
      />
    </>
  );
}
