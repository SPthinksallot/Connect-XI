import React from "react";

const PALETTE = [
  ["#7C5CFF", "#5130D4"],  // brand violet
  ["#FF5CAA", "#E8448F"],  // accent pink
  ["#22D3A0", "#16A37A"],  // mint
  ["#FF8C42", "#D46020"],  // amber
  ["#5CB8FF", "#2E90E0"],  // sky
  ["#A855F7", "#7C3AED"],  // purple
  ["#F97316", "#C2550A"],  // orange
];

const getColorPair = (name = "") => PALETTE[name.charCodeAt(0) % PALETTE.length];

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

const SIZE_MAP = {
  xs:  { outer: "w-7 h-7",   text: "text-[10px]", dot: "w-2 h-2",   dotPos: "-bottom-px -right-px", dotBorder: "border" },
  sm:  { outer: "w-9 h-9",   text: "text-xs",      dot: "w-2.5 h-2.5", dotPos: "bottom-0 right-0",   dotBorder: "border-2" },
  md:  { outer: "w-11 h-11", text: "text-sm",      dot: "w-3 h-3",   dotPos: "bottom-0.5 right-0.5", dotBorder: "border-2" },
  lg:  { outer: "w-14 h-14", text: "text-base",    dot: "w-3.5 h-3.5", dotPos: "bottom-0.5 right-0.5", dotBorder: "border-2" },
  xl:  { outer: "w-20 h-20", text: "text-xl",      dot: "w-4 h-4",   dotPos: "bottom-1 right-1",     dotBorder: "border-2" },
};

export default function Avatar({ name = "", src, size = "md", online, className = "" }) {
  const s = SIZE_MAP[size] || SIZE_MAP.md;
  const [light, dark] = getColorPair(name);

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${s.outer} rounded-full object-cover ring-2 ring-white/10 dark:ring-black/20`}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <div
          className={`${s.outer} rounded-full flex items-center justify-center font-bold text-white select-none ring-2 ring-white/10 dark:ring-black/20`}
          style={{ background: `linear-gradient(135deg, ${light}, ${dark})` }}
        >
          <span className={s.text}>{getInitials(name)}</span>
        </div>
      )}

      {online !== undefined && (
        <span
          className={`absolute ${s.dotPos} ${s.dotBorder} ${s.dot} rounded-full
            ${online ? "bg-[#22D3A0]" : "bg-[#5B6180]"}
            border-white dark:border-[#111318]`}
          aria-label={online ? "Online" : "Offline"}
        />
      )}
    </div>
  );
}
