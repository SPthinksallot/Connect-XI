import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { aiApi } from "../../api/aiApi";
import Spinner from "../common/Spinner";
import useChatStore from "../../store/useChatStore";

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
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <Spinner size="lg" />
          <p className="text-ink-400 text-sm">Reading conversation...</p>
        </div>
      ) : error ? (
        <div className="py-6 text-center">
          <p className="text-coral-500 mb-4">{error}</p>
          <button onClick={onClose} className="px-4 py-2 bg-paper-200 hover:bg-paper-300 dark:bg-ink-700 dark:hover:bg-ink-600 rounded-lg text-sm transition-colors text-ink-900 dark:text-paper-50">
            Close
          </button>
        </div>
      ) : summary ? (
        <div className="space-y-4">
          <p className="text-xs text-violet-400 font-medium uppercase tracking-wider">{summary.range}</p>
          <ul className="space-y-2">
            {summary.bullets?.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-900 dark:text-paper-50">
                <span className="text-violet-500 mt-1">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-end">
             <button onClick={onClose} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm text-white transition-colors">
                Done
             </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
