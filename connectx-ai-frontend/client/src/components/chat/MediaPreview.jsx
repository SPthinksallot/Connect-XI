import React, { useState } from "react";
import { Download, ZoomIn, Play, FileText, X } from "lucide-react";
import { formatFileSize } from "../../utils/formatTime";

export default function MediaPreview({ mediaUrl, mediaType, mediaName, className = "" }) {
  const [zoomed, setZoomed] = useState(false);

  if (!mediaUrl || !mediaType) return null;

  if (mediaType === "image") {
    return (
      <>
        <div
          className={`relative group rounded-xl overflow-hidden cursor-pointer max-w-[280px] sm:max-w-xs shadow-sm ring-1 ring-black/5 dark:ring-white/10 ${className}`}
          onClick={() => setZoomed(true)}
        >
          <img
            src={mediaUrl}
            alt={mediaName || "Image"}
            className="w-full max-h-64 object-cover rounded-xl bg-black/5 dark:bg-white/5"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
            <ZoomIn size={24} className="text-white drop-shadow-md" />
          </div>
        </div>

        {/* Lightbox */}
        {zoomed && (
          <div
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setZoomed(false)}
          >
            <button className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm">
              <X size={20} />
            </button>
            <img src={mediaUrl} alt={mediaName} className="max-w-full max-h-[90vh] object-contain rounded-lg animate-scale-in shadow-2xl" />
          </div>
        )}
      </>
    );
  }

  if (mediaType === "video") {
    return (
      <div className={`rounded-xl overflow-hidden max-w-[280px] sm:max-w-xs shadow-sm ring-1 ring-black/5 dark:ring-white/10 bg-black ${className}`}>
        <video controls className="w-full max-h-64 rounded-xl" src={mediaUrl}>
          Your browser does not support video.
        </video>
      </div>
    );
  }

  if (mediaType === "audio") {
    return (
      <div className={`flex items-center gap-3 p-2 bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/5 rounded-2xl min-w-[200px] max-w-xs backdrop-blur-sm ${className}`}>
        <audio controls className="w-full h-9 outline-none" src={mediaUrl} />
      </div>
    );
  }

  // Generic file
  return (
    <a
      href={mediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 p-3 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 rounded-2xl transition-colors max-w-[260px] sm:max-w-xs backdrop-blur-sm group ${className}`}
    >
      <div className="w-10 h-10 rounded-[14px] bg-[#7C5CFF]/15 flex items-center justify-center shrink-0 text-[#7C5CFF] group-hover:scale-105 transition-transform">
        <FileText size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-current truncate leading-tight">{mediaName || "Attachment"}</p>
        <p className="text-[11px] opacity-70 mt-0.5 uppercase tracking-wide font-medium">Click to open</p>
      </div>
      <Download size={16} className="opacity-50 group-hover:opacity-100 shrink-0 transition-opacity" />
    </a>
  );
}
