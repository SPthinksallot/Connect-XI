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
    <div className="flex items-center gap-2 px-4 py-1 animate-[fadeIn_0.2s_ease]">
      <div className="flex items-center gap-1 bg-white dark:bg-ink-800 border border-paper-200 dark:border-ink-700 rounded-2xl rounded-bl-none px-3 py-2 shadow-sm">
        {/* Animated dots */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
            />
          ))}
        </div>
      </div>
      <span className="text-xs text-ink-500 italic">{label}</span>
    </div>
  );
}
