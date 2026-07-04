import React from "react";

export default function TypingIndicator({ names = [] }) {
  if (!names.length) return null;

  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : `${names[0]} and ${names.length - 1} others are typing`;

  return (
    <div className="flex items-center gap-2.5 px-4 py-1 mb-2 animate-fade-in">
      <div className="flex items-center gap-1 bg-white dark:bg-[#1A1D27] border border-[#E9E6DF] dark:border-[#2A2F45] rounded-[20px] rounded-bl-[4px] px-3.5 py-2.5 shadow-sm">
        {/* Animated dots */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-[#7C5CFF] rounded-full"
              style={{
                animation: `bounceIn 1s infinite`,
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      </div>
      <span className="text-xs text-[#9AA0B8] dark:text-[#5B6180] font-medium">{label}</span>
    </div>
  );
}
