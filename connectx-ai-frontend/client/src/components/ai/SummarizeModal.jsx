import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { aiApi } from "../../api/aiApi";
import Spinner from "../common/Spinner";
import useChatStore from "../../store/useChatStore";
import { Sparkles, CheckCircle } from "lucide-react";

export default function SummarizeModal({ chatId, onClose }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { messagesByChat } = useChatStore();

  useEffect(() => {
    let isMounted = true;
    const fetchSummary = async () => {
      try {
        const messages = messagesByChat[chatId] || [];
        if (messages.length < 3) {
          throw new Error("Not enough messages to summarize (need at least 3).");
        }

        const formatted = messages.map(m => ({
          senderName: m.sender?.displayName || m.sender?.username || "Unknown",
          content: m.content || "[Media]"
        }));

        const { data } = await aiApi.summarizeChat(formatted);
        if (isMounted) setSummary(data.data.summary);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || err.message || "Failed to summarize chat");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSummary();
    return () => { isMounted = false; };
  }, [chatId, messagesByChat]);

  return (
    <Modal isOpen={true} onClose={onClose} title="AI Chat Summary" size="md">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4 animate-fade-in">
          <Spinner size="lg" />
          <p className="text-[#9AA0B8] dark:text-[#5B6180] text-sm font-medium">Reading conversation…</p>
        </div>
      ) : error ? (
        <div className="py-8 text-center animate-fade-in">
          <p className="text-[#FF5C6B] mb-6 font-medium bg-[#FF5C6B]/10 p-4 rounded-2xl inline-block">{error}</p>
          <button onClick={onClose} className="btn-primary w-full">
            Close
          </button>
        </div>
      ) : summary ? (
        <div className="space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#7C5CFF]/10 text-[#7C5CFF] rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            {summary.range}
          </div>
          
          <ul className="space-y-3">
            {summary.bullets?.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#18192A] dark:text-[#F0EEEA] leading-relaxed">
                <CheckCircle size={16} className="text-[#22D3A0] shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 pt-4 border-t border-[#E9E6DF] dark:border-[#2A2F45]">
             <button onClick={onClose} className="btn-primary w-full">
                Done
             </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
