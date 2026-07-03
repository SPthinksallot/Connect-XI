import React from "react";

export default function Spinner({ size = "md", className = "" }) {
  const sz = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" }[size] || "w-6 h-6";
  return (
    <div
      className={`${sz} border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin ${className}`}
    />
  );
}
