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
          className={`relative group rounded-xl overflow-hidden cursor-pointer max-w-xs ${className}`}
          onClick={() => setZoomed(true)}
        >
          <img
            src={mediaUrl}
            alt={mediaName || "Image"}
            className="w-full max-h-64 object-cover rounded-xl"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <ZoomIn size={24} className="text-white" />
          </div>
        </div>

        {/* Lightbox */}
        {zoomed && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setZoomed(false)}
          >
            <button className="absolute top-4 right-4 p-2 text-white/70 hover:text-white">
              <X size={24} />
            </button>
            <img src={mediaUrl} alt={mediaName} className="max-w-full max-h-full object-contain rounded-xl" />
          </div>
        )}
      </>
    );
  }

  if (mediaType === "video") {
    return (
      <div className={`rounded-xl overflow-hidden max-w-xs ${className}`}>
        <video controls className="w-full max-h-64 rounded-xl bg-black" src={mediaUrl}>
          Your browser does not support video.
        </video>
      </div>
    );
  }

  if (mediaType === "audio") {
    return (
      <div className={`flex items-center gap-3 p-3 bg-ink-700/50 rounded-xl min-w-[200px] max-w-xs ${className}`}>
        <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center shrink-0">
          <Play size={14} className="text-violet-400" />
        </div>
        <audio controls className="flex-1 h-8" src={mediaUrl} />
      </div>
    );
  }

  // Generic file
  return (
    <a
      href={mediaUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 p-3 bg-ink-700/50 hover:bg-ink-600/50 rounded-xl transition-colors max-w-xs ${className}`}
    >
      <div className="w-9 h-9 rounded-xl bg-violet-600/20 flex items-center justify-center shrink-0">
        <FileText size={16} className="text-violet-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-paper-50 truncate">{mediaName || "File"}</p>
        <p className="text-xs text-ink-400">Click to open</p>
      </div>
      <Download size={15} className="text-ink-400 shrink-0" />
    </a>
  );
}
