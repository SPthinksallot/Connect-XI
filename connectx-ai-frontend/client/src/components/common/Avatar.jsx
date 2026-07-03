import React from "react";

const COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500",
  "bg-rose-500", "bg-amber-500", "bg-cyan-500", "bg-pink-500",
];

const getColor = (name = "") => COLORS[name.charCodeAt(0) % COLORS.length];

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const SIZE_MAP = {
  xs: "w-7 h-7 text-xs",
  sm: "w-9 h-9 text-sm",
  md: "w-11 h-11 text-base",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
};

export default function Avatar({ name = "", src, size = "md", online, className = "" }) {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;
  const colorClass = getColor(name);

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeClass} rounded-full object-cover ring-2 ring-white/10`}
        />
      ) : (
        <div
          className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-semibold text-white select-none ring-2 ring-white/10`}
        >
          {getInitials(name)}
        </div>
      )}
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full border-2 border-ink-900 w-2.5 h-2.5 ${
            online ? "bg-mint-500" : "bg-ink-500"
          }`}
        />
      )}
    </div>
  );
}
