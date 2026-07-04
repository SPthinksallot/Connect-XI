import React, { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { aiApi } from "../../api/aiApi";
import Spinner from "../common/Spinner";

export default function SmartReplyChips({ messages, onSelect }) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!messages?.length) return;
    const last = messages[messages.length - 1];
    // Don't show smart replies if the last message was from me
    if (last.senderName === "User") return;

    let isMounted = true;
    const fetchReplies = async () => {
      setLoading(true);
      try {
        const { data } = await aiApi.getSmartReplies(messages);
        if (isMounted && data.data.suggestions) {
          setReplies(data.data.suggestions);
        }
      } catch (err) {
        console.error("Smart reply error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReplies();
    return () => { isMounted = false; };
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 border-t border-[#E9E6DF] dark:border-[#2A2F45] bg-[#F7F6F4]/60 dark:bg-[#111318]/60">
        <Sparkles size={12} className="text-[#7C5CFF] animate-pulse shrink-0" />
        <Spinner size="sm" />
        <span className="text-xs text-[#9AA0B8] dark:text-[#5B6180]">Generating replies…</span>
      </div>
    );
  }

  if (!replies.length) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-t border-[#E9E6DF] dark:border-[#2A2F45] bg-[#F7F6F4]/60 dark:bg-[#111318]/60 overflow-x-auto scrollbar-thin">
      <Sparkles size={12} className="text-[#7C5CFF] shrink-0 opacity-70" />
      {replies.map((r, i) => {
        const clean = String(r)
          .replace(/```json?\s*/gi, "")
          .replace(/```/g, "")
          .replace(/^\[|\]$/g, "")
          .trim();
        if (!clean || clean.startsWith("[") || clean.startsWith("{")) return null;
        return (
          <button
            key={i}
            onClick={() => { onSelect(clean); setReplies([]); }}
            className="px-3 py-1.5 text-xs font-medium text-[#7C5CFF] dark:text-[#9B8FFF]
              bg-[#7C5CFF]/8 dark:bg-[#7C5CFF]/15
              hover:bg-[#7C5CFF]/15 dark:hover:bg-[#7C5CFF]/25
              border border-[#7C5CFF]/20 dark:border-[#7C5CFF]/30
              rounded-full whitespace-nowrap transition-all hover:scale-105 active:scale-95"
          >
            {clean}
          </button>
        );
      })}
      <button
        onClick={() => setReplies([])}
        className="ml-auto shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[#9AA0B8] hover:text-[#FF5C6B] hover:bg-[#FF5C6B]/10 transition-colors"
        aria-label="Dismiss"
      >
        <X size={11} />
      </button>
    </div>
  );
}
