import React, { useState } from "react";
import { Languages } from "lucide-react";
import { aiApi } from "../../api/aiApi";
import Spinner from "../common/Spinner";

export default function TranslateToggle({ text, messageId, isMine }) {
  const [translated, setTranslated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTrans, setShowTrans] = useState(false);

  const handleTranslate = async () => {
    if (translated) {
      setShowTrans(!showTrans);
      return;
    }

    setLoading(true);
    try {
      // Simplistic detection: if text contains hindi characters, translate to en, else hi
      const hasHindi = /[\u0900-\u097F]/.test(text);
      const targetLang = hasHindi ? "en" : "hi";
      
      const { data } = await aiApi.translateMessage(text, targetLang);
      setTranslated({
        text: data.data.translated,
        lang: targetLang === "hi" ? "Hindi" : "English"
      });
      setShowTrans(true);
    } catch (err) {
      console.error("Translate error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-1">
      <button
        onClick={handleTranslate}
        disabled={loading}
        className={`flex items-center gap-1 text-[10px] font-medium transition-colors ${
          isMine ? "text-white/80 hover:text-white" : "text-violet-500 dark:text-violet-400 hover:text-violet-600 dark:hover:text-violet-300"
        }`}
      >
        {loading ? <Spinner size="sm" /> : <Languages size={10} />}
        {showTrans ? "Show original" : "Translate"}
      </button>

      {showTrans && translated && (
        <div className={`mt-1.5 pt-1.5 border-t text-sm italic ${
          isMine ? "border-white/30 text-white/90" : "border-paper-200 dark:border-ink-700 text-ink-600 dark:text-ink-200"
        }`}>
          <span className="text-[10px] uppercase tracking-wider block mb-0.5 opacity-70">
            {translated.lang}
          </span>
          {translated.text}
        </div>
      )}
    </div>
  );
}
