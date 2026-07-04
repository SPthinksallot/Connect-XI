import React, { useState, useRef } from "react";
import { Send, Paperclip, X, Reply, Mic } from "lucide-react";
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
    <div className="shrink-0 border-t border-[#E9E6DF] dark:border-[#2A2F45] bg-[#FFFFFF]/80 dark:bg-[#111318]/80 backdrop-blur-xl transition-colors duration-300 relative z-20">
      {/* Smart Replies */}
      <SmartReplyChips messages={lastMessages} onSelect={(reply) => setText(reply)} />

      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[#E9E6DF] dark:border-[#2A2F45] bg-[#7C5CFF]/5">
          <div className="w-1 h-10 bg-[#7C5CFF] rounded-full shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#7C5CFF] font-bold">
              Replying to {replyTo.sender?.displayName || "message"}
            </p>
            <p className="text-xs text-[#5A6080] dark:text-[#9AA0B8] truncate font-medium mt-0.5">{replyTo.content || "[media]"}</p>
          </div>
          <button onClick={onCancelReply} className="text-[#9AA0B8] hover:text-[#FF5C6B] hover:bg-[#FF5C6B]/10 transition-colors p-1.5 rounded-xl shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

      {/* File preview */}
      {file && (
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[#E9E6DF] dark:border-[#2A2F45] bg-[#7C5CFF]/5">
          {filePreview ? (
            <img src={filePreview} alt="preview" className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#7C5CFF]/30 shadow-md" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[#F5F3EF] dark:bg-[#1A1D27] border border-[#E9E6DF] dark:border-[#2A2F45] flex items-center justify-center shadow-sm">
              <Paperclip size={18} className="text-[#7C5CFF]" />
            </div>
          )}
          <span className="text-sm text-[#18192A] dark:text-[#F0EEEA] flex-1 truncate font-medium">{file.name}</span>
          <button onClick={clearFile} className="text-[#9AA0B8] hover:text-[#FF5C6B] hover:bg-[#FF5C6B]/10 transition-colors p-1.5 rounded-xl shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-3 px-4 py-4">
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
          className="w-11 h-11 flex items-center justify-center rounded-[18px] text-[#9AA0B8] hover:text-[#7C5CFF] hover:bg-[#7C5CFF]/10 transition-all duration-200 shrink-0"
        >
          <Paperclip size={22} strokeWidth={2.5} />
        </button>

        {/* Text area or Voice recorder */}
        {showVoice ? (
          <div className="flex-1 bg-[#F5F3EF] dark:bg-[#1A1D27] rounded-[22px] py-1 border border-transparent shadow-sm">
            <VoiceRecorder onSend={handleVoiceSend} onCancel={() => setShowVoice(false)} />
          </div>
        ) : (
          <div className="flex-1 relative group">
            <textarea
              ref={textareaRef}
              id="message-input"
              placeholder="Message..."
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              rows={1}
              className="w-full resize-none bg-[#F5F3EF] dark:bg-[#1A1D27] border border-transparent rounded-[22px] px-5 py-3 text-[15px] text-[#18192A] dark:text-[#F0EEEA] placeholder-[#9AA0B8] dark:placeholder-[#5B6180] focus:border-[#7C5CFF] focus:ring-2 focus:ring-[#7C5CFF]/20 focus:bg-white dark:focus:bg-[#1A1D27] outline-none transition-all duration-200 shadow-sm scrollbar-thin"
              style={{ maxHeight: "120px", overflowY: "auto", minHeight: "48px" }}
            />
          </div>
        )}

        {/* Voice toggle */}
        {!showVoice && !text.trim() && !file && (
          <button
            type="button"
            onClick={() => setShowVoice(true)}
            id="voice-toggle-btn"
            className="w-11 h-11 flex items-center justify-center rounded-[18px] text-[#9AA0B8] hover:text-[#7C5CFF] hover:bg-[#7C5CFF]/10 transition-all duration-200 shrink-0"
          >
            <Mic size={22} strokeWidth={2.5} />
          </button>
        )}

        {/* Send */}
        {(text.trim() || file) && (
          <button
            type="button"
            id="send-message-btn"
            onClick={handleSend}
            disabled={sending}
            className="w-12 h-12 flex items-center justify-center rounded-[20px] bg-gradient-to-br from-[#7C5CFF] to-[#FF5CAA] text-white hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-[#7C5CFF]/30 shrink-0 animate-scale-in"
          >
            <Send size={18} strokeWidth={2.5} className="ml-1" />
          </button>
        )}
      </div>
    </div>
  );
}
