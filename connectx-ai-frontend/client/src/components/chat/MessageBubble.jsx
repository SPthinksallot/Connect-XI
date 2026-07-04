import React, { useState } from "react";
import { formatMessageTime } from "../../utils/formatTime";
import { CheckCheck, Clock, Trash2, Reply } from "lucide-react";
import MediaPreview from "./MediaPreview";
import TranslateToggle from "../ai/TranslateToggle";
import Avatar from "../common/Avatar";

const STATUS_ICON = {
  sent: <Clock size={11} className="text-white/70" />,
  delivered: <CheckCheck size={11} className="text-white/80" />,
  read: <CheckCheck size={11} className="text-white" />,
};

const EMOJI_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export default function MessageBubble({ message, isMine, showAvatar, onDelete, onReply, onReact }) {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { content, mediaUrl, mediaType, mediaName, sender, createdAt, status, isDeleted, reactions, replyTo, voiceText } = message;

  if (isDeleted) {
    return (
      <div className={`flex ${isMine ? "justify-end" : "justify-start"} px-4 mb-2`}>
        <div className="italic text-xs text-[#9AA0B8] dark:text-[#5B6180] px-4 py-2.5 bg-[#F5F3EF] dark:bg-[#1A1D27]/50 rounded-2xl border border-[#D8D3C6] dark:border-[#2A2F45]/50 flex items-center gap-2">
          <Trash2 size={12} />
          Message deleted
        </div>
      </div>
    );
  }

  const senderName = sender?.displayName || sender?.username || "";

  return (
    <div
      className={`flex items-end gap-2 px-4 group mb-2 animate-fade-in ${isMine ? "flex-row-reverse" : "flex-row"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowEmojiPicker(false); }}
    >
      {/* Avatar (others only) */}
      {!isMine && (
        <div className="w-7 shrink-0 mb-1">
          {showAvatar ? <Avatar name={senderName} src={sender?.avatar} size="xs" /> : <div className="w-7" />}
        </div>
      )}

      <div className={`flex flex-col max-w-[75%] md:max-w-[65%] ${isMine ? "items-end" : "items-start"}`}>
        {/* Sender name (groups) */}
        {!isMine && showAvatar && (
          <span className="text-[11px] text-[#7C5CFF] font-semibold ml-1 mb-1 tracking-wide">{senderName}</span>
        )}

        {/* Reply-to preview */}
        {replyTo && (
          <div className={`flex items-start gap-2 px-3 py-2 mb-1.5 rounded-xl border-l-4 border-[#7C5CFF] bg-[#F5F3EF] dark:bg-[#1A1D27] text-xs max-w-full relative opacity-90 ${isMine ? "self-end" : "self-start"}`}>
            <Reply size={12} className="text-[#7C5CFF] shrink-0 mt-0.5" />
            <span className="truncate text-[#5A6080] dark:text-[#9AA0B8]">{replyTo.content || "[media]"}</span>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`relative px-4 py-2.5 shadow-sm
            ${isMine
              ? "bg-gradient-to-br from-[#7C5CFF] to-[#6645F0] text-white rounded-[20px] rounded-br-[4px]"
              : "bg-white dark:bg-[#1A1D27] border border-[#E9E6DF] dark:border-[#2A2F45] text-[#18192A] dark:text-[#F0EEEA] rounded-[20px] rounded-bl-[4px]"
            }`}
        >
          {/* Media */}
          {mediaUrl && <MediaPreview mediaUrl={mediaUrl} mediaType={mediaType} mediaName={mediaName} className="mb-2" />}

          {/* Text content */}
          {content && (
            <p className={`text-[15px] leading-[1.4] whitespace-pre-wrap break-words ${isMine ? "text-white" : "text-[#18192A] dark:text-[#F0EEEA]"}`}>
              {content}
            </p>
          )}

          {/* Voice transcription */}
          {voiceText && !content && (
            <p className={`text-[15px] italic leading-[1.4] ${isMine ? "text-white/80" : "text-[#5A6080] dark:text-[#9AA0B8]"}`}>🎤 "{voiceText}"</p>
          )}

          {/* Translate toggle */}
          {(content || voiceText) && (
            <TranslateToggle
              text={content || voiceText}
              messageId={message._id}
              isMine={isMine}
            />
          )}

          {/* Timestamp + status */}
          <div className={`flex items-center gap-1.5 mt-1.5 ${isMine ? "justify-end" : "justify-start"}`}>
            <span className={`text-[10px] font-medium ${isMine ? "text-white/70" : "text-[#9AA0B8] dark:text-[#5B6180]"}`}>
              {formatMessageTime(createdAt)}
            </span>
            {isMine && STATUS_ICON[status]}
          </div>
        </div>

        {/* Reactions */}
        {reactions?.length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
            {Object.entries(
              reactions.reduce((acc, r) => {
                acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                return acc;
              }, {})
            ).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => onReact?.(message._id, emoji)}
                className="flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-[#111318] border border-[#E9E6DF] dark:border-[#2A2F45] rounded-full text-xs shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                <span>{emoji}</span>
                {count > 1 && <span className="text-[#5A6080] dark:text-[#9AA0B8] font-bold text-[10px]">{count}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hover actions */}
      {showActions && (
        <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mb-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker((s) => !s)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-lg hover:bg-[#F5F3EF] dark:hover:bg-[#222636] transition-colors"
              title="React"
            >
              😊
            </button>
            {showEmojiPicker && (
              <div className={`absolute bottom-full mb-2 flex gap-1 p-2 bg-white dark:bg-[#1A1D27] border border-[#E9E6DF] dark:border-[#2A2F45] rounded-2xl shadow-xl shadow-black/10 z-20 animate-scale-in origin-bottom ${isMine ? "right-0" : "left-0"}`}>
                {EMOJI_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => { onReact?.(message._id, emoji); setShowEmojiPicker(false); }}
                    className="w-8 h-8 flex items-center justify-center text-xl hover:scale-125 transition-transform origin-bottom"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onReply?.(message)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[#9AA0B8] hover:text-[#18192A] dark:hover:text-[#F0EEEA] hover:bg-[#F5F3EF] dark:hover:bg-[#222636] transition-colors"
            title="Reply"
          >
            <Reply size={15} />
          </button>
          {isMine && (
            <button
              onClick={() => onDelete?.(message._id)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#9AA0B8] hover:text-[#FF5C6B] hover:bg-[#FF5C6B]/10 transition-colors"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
