import { Sparkles } from "lucide-react";

export default function SmartReplySuggestions({ suggestions, onSelect }) {
  if (!suggestions?.length) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto px-4 pb-2 pt-1">
      <Sparkles className="h-3.5 w-3.5 shrink-0 text-violet-500" />
      {suggestions.map((text, i) => (
        <button
          key={i}
          onClick={() => onSelect(text)}
          className="shrink-0 whitespace-nowrap rounded-full border border-violet-500/30 bg-violet-500/5 px-3.5 py-1.5 text-sm text-violet-600 transition-colors hover:bg-violet-500/15 dark:text-violet-300"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
