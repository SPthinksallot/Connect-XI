import React from "react";

export default function Spinner({ size = "md", className = "" }) {
  const sz = { sm: "w-4 h-4 border-[2px]", md: "w-6 h-6 border-2", lg: "w-10 h-10 border-[3px]" }[size] || "w-6 h-6 border-2";
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`${sz} rounded-full border-brand-500/25 border-t-brand-500 animate-spin ${className}`}
      style={{
        borderColor: "rgba(124, 92, 255, 0.2)",
        borderTopColor: "#7C5CFF",
        animation: "spinnerRing 0.75s linear infinite",
      }}
    />
  );
}
