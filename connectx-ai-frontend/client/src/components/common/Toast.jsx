import React from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import useToastStore from "../../store/useToastStore";

const ICONS = {
  success: <CheckCircle size={18} className="text-[#22D3A0]" />,
  error: <AlertCircle size={18} className="text-[#FF5C6B]" />,
  info: <Info size={18} className="text-[#7C5CFF]" />,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type} pointer-events-auto flex items-center justify-between min-w-[300px] max-w-[90vw]`}
        >
          <div className="flex items-center gap-3">
            {ICONS[t.type]}
            <p className="flex-1">{t.message}</p>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="ml-4 text-inherit opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
