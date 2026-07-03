import { X, FileText } from "lucide-react";

export default function ChatSummaryModal({ summary, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-paper-50 p-6 shadow-2xl dark:bg-ink-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/10">
              <FileText className="h-4.5 w-4.5 text-violet-500" />
            </div>
            <div>
              <h2 className="font-display font-semibold">Conversation summary</h2>
              <p className="text-xs text-ink-400">{summary.range}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close summary"
            className="rounded-full p-1.5 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ul className="mt-5 space-y-3">
          {summary.bullets.map((point, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
              <span className="text-ink-700 dark:text-paper-100">{point}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs text-ink-400">
          Generated from this conversation. Summaries may not capture every detail.
        </p>
      </div>
    </div>
  );
}
