import React, { useState, useRef } from "react";
import { Send, Paperclip, X, Reply } from "lucide-react";
import VoiceRecorder from "./VoiceRecorder";
import { useTyping } from "../../hooks/useTyping";
import { messageApi } from "../../api/messageApi";
import useChatStore from "../../store/useChatStore";
import SmartReplyChips from "../ai/SmartReplyChips";

export default function MessageInput({ chatId, chatType, replyTo, onCancelReply }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showVoice, setShowVoice] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const { addMessage, messagesByChat } = useChatStore();
  const { startTyping, stopTyping } = useTyping(chatId);

  const handleTextChange = (e) => {
    setText(e.target.value);
    startTyping();
    // Auto-grow textarea
    const ta = textareaRef.current;
    if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 120) + "px"; }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    if (f.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(f));
    } else {
      setFilePreview(null);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if ((!text.trim() && !file) || sending) return;
    stopTyping();
    setSending(true);

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("chatType", chatType || "Chat");
        if (text.trim()) formData.append("content", text.trim());
        const { data } = await messageApi.sendMedia(chatId, formData);
        addMessage(chatId, data.data.message);
        clearFile();
      } else {
        const { data } = await messageApi.sendMessage(chatId, {
          content: text.trim(),
          chatType: chatType || "Chat",
          replyTo: replyTo?._id,
        });
        addMessage(chatId, data.data.message);
      }
      setText("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      onCancelReply?.();
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceSend = async (blob, transcript) => {
    setShowVoice(false);
    if (!blob) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("file", blob, "voice-note.webm");
      formData.append("chatType", chatType || "Chat");
      if (transcript) formData.append("content", transcript);
      const { data } = await messageApi.sendMedia(chatId, formData);
      addMessage(chatId, data.data.message);
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const lastMessages = (messagesByChat[chatId] || []).slice(-5).map((m) => ({
    senderName: m.sender?.displayName || "User",
    content: m.content || "",
  }));

  return (
    <div className="shrink-0 border-t border-paper-200 dark:border-ink-800/50 bg-paper-100/80 dark:bg-ink-900/40 backdrop-blur-md transition-colors duration-300">
      {/* Smart Replies */}
      <SmartReplyChips messages={lastMessages} onSelect={(reply) => setText(reply)} />

      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-paper-200 dark:border-ink-800/50 bg-violet-500/10">
          <Reply size={16} className="text-violet-500 dark:text-violet-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-violet-600 dark:text-violet-400 font-bold">
              Replying to {replyTo.sender?.displayName || "message"}
            </p>
            <p className="text-xs text-ink-500 truncate font-medium">{replyTo.content || "[media]"}</p>
          </div>
          <button onClick={onCancelReply} className="text-ink-400 hover:text-ink-900 dark:hover:text-paper-50 transition-colors p-1 rounded-lg hover:bg-paper-200 dark:hover:bg-ink-800/50">
            <X size={16} />
          </button>
        </div>
      )}

      {/* File preview */}
      {file && (
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-paper-200 dark:border-ink-800/50 bg-violet-500/5">
          {filePreview ? (
            <img src={filePreview} alt="preview" className="w-12 h-12 rounded-xl object-cover ring-2 ring-violet-500/30 shadow-lg" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-paper-200 dark:bg-ink-800 border border-paper-300 dark:border-ink-700 flex items-center justify-center shadow-sm">
              <Paperclip size={16} className="text-violet-500 dark:text-violet-400" />
            </div>
          )}
          <span className="text-sm text-ink-900 dark:text-paper-50 flex-1 truncate font-medium">{file.name}</span>
          <button onClick={clearFile} className="text-ink-400 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2.5 px-4 py-4">
        {/* File attach */}
        <input
          ref={fileInputRef}
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          id="attach-file-btn"
          className="p-2.5 rounded-xl text-ink-500 hover:text-violet-600 dark:text-ink-400 dark:hover:text-violet-400 hover:bg-violet-500/10 dark:hover:bg-violet-500/20 transition-all duration-200 shrink-0 shadow-sm"
        >
          <Paperclip size={20} />
        </button>

        {/* Text area or Voice recorder */}
        {showVoice ? (
          <div className="flex-1">
            <VoiceRecorder onSend={handleVoiceSend} onCancel={() => setShowVoice(false)} />
          </div>
        ) : (
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              id="message-input"
              placeholder="Type a message…"
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              rows={1}
              className="w-full resize-none bg-white dark:bg-ink-800/60 border border-paper-200 dark:border-ink-700/50 rounded-2xl px-4 py-3 text-sm text-ink-900 dark:text-paper-50 placeholder-ink-400 dark:placeholder-ink-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none transition-all shadow-sm scrollbar-thin"
              style={{ maxHeight: "120px", overflowY: "auto" }}
            />
          </div>
        )}

        {/* Voice toggle */}
        {!showVoice && !text.trim() && !file && (
          <button
            type="button"
            onClick={() => setShowVoice(true)}
            id="voice-toggle-btn"
            className="p-2.5 rounded-xl text-ink-500 hover:text-violet-600 dark:text-ink-400 dark:hover:text-violet-400 hover:bg-violet-500/10 dark:hover:bg-violet-500/20 transition-all duration-200 shrink-0 shadow-sm"
          >
            <span className="text-xl">🎤</span>
          </button>
        )}

        {/* Send */}
        {(text.trim() || file) && (
          <button
            type="button"
            id="send-message-btn"
            onClick={handleSend}
            disabled={sending}
            className="p-3 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white transition-all duration-200 disabled:opacity-50 shadow-xl shadow-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/50 shrink-0 hover:scale-105 active:scale-95"
          >
            <Send size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
