import React, { useEffect } from "react";
import { Mic, Square, X, Loader } from "lucide-react";
import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";
import { formatDuration } from "../../utils/formatTime";

export default function VoiceRecorder({ onSend, onCancel }) {
  const { isRecording, duration, transcript, error, startRecording, stopRecording, cancelRecording } =
    useVoiceRecorder({
      onAudioBlob: (blob) => {
        onSend?.(blob, transcript);
      },
    });

  useEffect(() => {
    // Auto-start recording when mounted
    if (!isRecording) startRecording();
  }, [isRecording, startRecording]);

  const handleStop = () => stopRecording();

  const handleCancel = () => {
    cancelRecording();
    onCancel?.();
  };

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 animate-fade-in w-full h-full">
      {/* Pulse dot & Duration */}
      <div className="flex items-center gap-2 shrink-0 bg-[#FF5C6B]/10 px-2.5 py-1 rounded-full">
        <span className="w-2 h-2 bg-[#FF5C6B] rounded-full animate-pulse" />
        <span className="text-[13px] font-mono text-[#FF5C6B] font-medium">{formatDuration(duration)}</span>
      </div>

      {/* Transcript preview */}
      <div className="flex-1 min-w-0">
        {transcript ? (
          <span className="text-[14px] text-[#18192A] dark:text-[#F0EEEA] truncate italic block">"{transcript.trim()}"</span>
        ) : (
          <span className="text-[14px] text-[#9AA0B8] dark:text-[#5B6180] flex items-center gap-2 animate-pulse">
            Listening…
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={handleCancel}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[#9AA0B8] hover:text-[#FF5C6B] hover:bg-[#FF5C6B]/10 transition-colors"
        >
          <X size={18} />
        </button>
        <button
          type="button"
          onClick={handleStop}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#7C5CFF] text-white hover:bg-[#6645F0] hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#7C5CFF]/30"
        >
          <Square size={14} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
