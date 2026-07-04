import React from "react";
import { Zap } from "lucide-react";
import YaapIcon from "../common/YaapIcon";

export default function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-transparent relative overflow-hidden h-full">
      {/* Gradient orbs */}
      <div className="absolute w-[500px] h-[500px] bg-[#7C5CFF]/5 rounded-full blur-[80px] top-1/4 left-1/2 -translate-x-1/2 animate-pulse pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-[#FF5CAA]/5 rounded-full blur-[80px] top-1/3 left-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 text-center px-6 animate-slide-up">
        <div className="w-24 h-24 mx-auto mb-8 bg-white/60 dark:bg-[#1A1D27]/60 backdrop-blur-xl border border-[#D8D3C6] dark:border-[#2A2F45] rounded-[32px] flex items-center justify-center shadow-2xl shadow-[#7C5CFF]/10 transition-colors">
          <YaapIcon size={48} className="text-[#7C5CFF]" />
        </div>

        <h2 className="text-3xl font-bold text-[#18192A] dark:text-[#F0EEEA] mb-3 font-display transition-colors">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#FF5CAA]">Yaap</span>
        </h2>
        <p className="text-[#5A6080] dark:text-[#9AA0B8] text-base max-w-md leading-relaxed font-medium transition-colors mx-auto">
          Select a conversation from the list or search for someone new to start messaging.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 max-w-lg mx-auto">
          {["Smart Replies", "AI Summarize", "Translate", "Voice Notes", "Group Chats"].map((f, i) => (
            <span 
              key={f} 
              className="flex items-center gap-1.5 text-sm px-4 py-2 bg-white/50 dark:bg-[#1A1D27]/50 backdrop-blur-md border border-[#D8D3C6]/60 dark:border-[#2A2F45]/60 rounded-full text-[#5A6080] dark:text-[#9AA0B8] font-medium shadow-sm hover:scale-105 transition-all duration-200 cursor-default"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Zap size={14} className="text-[#FF5CAA]" />
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
