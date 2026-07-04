import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const SIZE_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export default function Modal({ isOpen, onClose, title, children, size = "md", className = "" }) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div
        className={`relative w-full ${SIZE_MAP[size]} mx-auto
          bg-white dark:bg-[#1A1D27]
          border border-[#D8D3C6] dark:border-[#2A2F45]
          rounded-t-3xl sm:rounded-3xl
          shadow-2xl shadow-black/10 dark:shadow-black/50
          animate-slide-up
          ${className}`}
        style={{ maxHeight: "92vh", overflow: "hidden", display: "flex", flexDirection: "column" }}
      >
        {/* Gradient top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7C5CFF] via-[#FF5CAA] to-[#7C5CFF] opacity-80 rounded-full" />

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E9E6DF] dark:border-[#2A2F45] shrink-0">
            <h2 className="text-lg font-bold text-[#18192A] dark:text-[#F0EEEA] font-display">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="btn-icon rounded-xl hover:bg-[#EDE9E0] dark:hover:bg-[#222636] text-[#5A6080] dark:text-[#9AA0B8] hover:text-[#18192A] dark:hover:text-[#F0EEEA]"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto scrollbar-thin flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
