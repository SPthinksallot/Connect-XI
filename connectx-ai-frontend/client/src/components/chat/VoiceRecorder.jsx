import React from "react";
import { Mic, Square, X, Loader } from "lucide-react";
import { useVoiceRecorder } from "../../hooks/useVoiceRecorder";
import { formatDuration } from "../../utils/formatTime";

export default function VoiceRecorder({ onSend, onCancel }) {
  const { isRecording, duration, transcript, error, startRecording, stopRecording, cancelRecording } =
    useVoiceRecorder({
      onAudioBlob: (blob) => {
        // Pass blob + transcript back to MessageInput for upload
        onSend?.(blob, transcript);
      },
    });

  const handleStop = () => {
    stopRecording();
  };

  const handleCancel = () => {
    cancelRecording();
    onCancel?.();
  };

  if (!isRecording) {
    return (
      <button
        id="voice-record-btn"
        type="button"
        onClick={startRecording}
        className="p-2 rounded-xl text-ink-400 hover:text-violet-400 hover:bg-violet-600/10 transition-all"
        title="Record voice note"
      >
        <Mic size={18} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-violet-600/10 border border-violet-500/30 rounded-xl animate-[fadeIn_0.2s_ease]">
      {/* Pulse dot */}
      <span className="w-2 h-2 bg-coral-500 rounded-full animate-pulse shrink-0" />

      {/* Duration */}
      <span className="text-sm font-mono text-paper-50 w-10 shrink-0">{formatDuration(duration)}</span>

      {/* Transcript preview */}
      {transcript && (
        <span className="text-xs text-ink-400 flex-1 truncate italic">"{transcript.trim()}"</span>
      )}
      {!transcript && (
        <span className="text-xs text-ink-500 flex-1">Listening…</span>
      )}

      {/* Cancel */}
      <button
        type="button"
        onClick={handleCancel}
        className="p-1.5 rounded-lg text-ink-400 hover:text-coral-500 hover:bg-coral-500/10 transition-colors"
      >
        <X size={15} />
      </button>

      {/* Stop + send */}
      <button
        type="button"
        onClick={handleStop}
        className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors"
      >
        <Square size={15} />
      </button>
    </div>
  );
}
