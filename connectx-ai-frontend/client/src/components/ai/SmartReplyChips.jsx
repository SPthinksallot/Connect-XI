import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { aiApi } from "../../api/aiApi";
import Spinner from "../common/Spinner";

export default function SmartReplyChips({ messages, onSelect }) {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only generate if there are recent messages, and the last one wasn't sent by me
    if (!messages?.length) return;
    const last = messages[messages.length - 1];
    if (last.senderName === "User") return; // "User" is the fallback name for me in lastMessages mapping

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
      <div className="flex items-center gap-2 px-4 py-2 border-t border-paper-200 dark:border-ink-700 bg-paper-100/50 dark:bg-ink-900/50">
        <Sparkles size={12} className="text-violet-500 dark:text-violet-400 animate-pulse" />
        <Spinner size="sm" />
        <span className="text-xs text-ink-500">Generating replies...</span>
      </div>
    );
  }

  if (!replies.length) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-t border-paper-200 dark:border-ink-700 bg-paper-100/50 dark:bg-ink-900/50 overflow-x-auto scrollbar-thin">
      <Sparkles size={12} className="text-violet-500 dark:text-violet-400 shrink-0 mt-0.5" />
      {replies.map((r, i) => (
        <button
          key={i}
          onClick={() => { onSelect(r); setReplies([]); }}
          className="px-3 py-1.5 text-xs text-violet-600 dark:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 rounded-full whitespace-nowrap transition-colors"
        >
          {r}
        </button>
      ))}
    </div>
  );
}
