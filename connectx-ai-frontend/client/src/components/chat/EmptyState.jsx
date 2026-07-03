import React from "react";
import { MessageSquare, Zap } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-transparent relative overflow-hidden">
      {/* Gradient orbs - enhanced */}
      <div className="absolute w-96 h-96 bg-violet-500/10 rounded-full blur-3xl top-1/4 left-1/2 -translate-x-1/2 animate-pulse" />
      <div className="absolute w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl top-1/3 left-1/2 -translate-x-1/4" />

      <div className="relative z-10 text-center px-6">
        <div className="w-24 h-24 mx-auto mb-8 bg-paper-100/80 dark:bg-ink-800/80 backdrop-blur-xl border border-paper-200 dark:border-ink-700/50 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/20 transition-colors">
          <MessageSquare size={44} className="text-violet-500 dark:text-violet-400 drop-shadow-lg" />
        </div>

        <h2 className="text-3xl font-bold text-ink-900 dark:text-paper-50 mb-3 font-display transition-colors">
          ConnectX <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
        </h2>
        <p className="text-ink-500 text-base max-w-md leading-relaxed font-medium transition-colors">
          Select a conversation to start messaging, or search for someone new.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5 max-w-lg">
          {["Smart Replies", "AI Summarize", "Translate", "Voice Notes", "Group Chats"].map((f) => (
            <span key={f} className="flex items-center gap-2 text-sm px-4 py-2 bg-paper-100/50 dark:bg-ink-800/50 backdrop-blur-sm border border-paper-200/50 dark:border-ink-700/40 rounded-2xl text-ink-600 dark:text-paper-100 font-medium shadow-lg hover:scale-105 transition-all duration-200">
              <Zap size={12} className="text-violet-400" />
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
