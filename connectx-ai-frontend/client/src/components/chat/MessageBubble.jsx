import React, { useState } from "react";
import { formatMessageTime } from "../../utils/formatTime";
import { CheckCheck, Check, Clock, Trash2, Reply, MoreHorizontal } from "lucide-react";
import MediaPreview from "./MediaPreview";
import TranslateToggle from "../ai/TranslateToggle";
import Avatar from "../common/Avatar";

const STATUS_ICON = {
  sent: <Clock size={11} className="text-ink-500" />,
  delivered: <CheckCheck size={11} className="text-ink-400" />,
  read: <CheckCheck size={11} className="text-violet-400" />,
};

const EMOJI_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

export default function MessageBubble({ message, isMine, showAvatar, onDelete, onReply, onReact }) {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { content, mediaUrl, mediaType, mediaName, sender, createdAt, status, isDeleted, reactions, replyTo, voiceText } = message;

  if (isDeleted) {
    return (
      <div className={`flex ${isMine ? "justify-end" : "justify-start"} px-4`}>
        <div className="italic text-xs text-ink-500 px-3 py-2 bg-paper-100 dark:bg-ink-800/50 rounded-xl border border-paper-200 dark:border-ink-700/50">
          🗑 Message deleted
        </div>
      </div>
    );
  }

  const senderName = sender?.displayName || sender?.username || "";

  return (
    <div
      className={`flex items-end gap-2 px-4 group ${isMine ? "flex-row-reverse" : "flex-row"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowEmojiPicker(false); }}
    >
      {/* Avatar (others only) */}
      {!isMine && (
        <div className="w-7 shrink-0 mb-1">
          {showAvatar && <Avatar name={senderName} src={sender?.avatar} size="xs" />}
        </div>
      )}

      <div className={`flex flex-col max-w-[72%] ${isMine ? "items-end" : "items-start"}`}>
        {/* Sender name (groups) */}
        {!isMine && showAvatar && (
          <span className="text-xs text-violet-400 font-medium ml-1 mb-0.5">{senderName}</span>
        )}

        {/* Reply-to preview */}
        {replyTo && (
          <div className={`flex items-start gap-2 px-3 py-2 mb-1 rounded-lg border-l-2 border-violet-500 bg-paper-100 dark:bg-ink-700/50 text-xs text-ink-500 max-w-full ${isMine ? "self-end" : "self-start"}`}>
            <Reply size={12} className="text-violet-500 shrink-0 mt-0.5" />
            <span className="truncate">{replyTo.content || "[media]"}</span>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`relative px-3 py-2 shadow-sm
            ${isMine
              ? "bg-gradient-to-br from-violet-600 to-violet-700 text-white rounded-2xl rounded-tr-md rounded-br-sm"
              : "bg-white dark:bg-ink-800 border border-paper-200 dark:border-ink-700 text-ink-900 dark:text-paper-50 rounded-2xl rounded-tl-md rounded-bl-sm"
            }`}
        >
          {/* Media */}
          {mediaUrl && <MediaPreview mediaUrl={mediaUrl} mediaType={mediaType} mediaName={mediaName} className="mb-2" />}

          {/* Text content */}
          {content && (
            <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${isMine ? "text-white" : "text-ink-900 dark:text-paper-50"}`}>
              {content}
            </p>
          )}

          {/* Voice transcription */}
          {voiceText && !content && (
            <p className="text-sm italic text-ink-300">🎤 "{voiceText}"</p>
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
          <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
            <span className={`text-[10px] ${isMine ? "text-white/60" : "text-ink-400 dark:text-ink-500"}`}>
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
                className="flex items-center gap-0.5 px-1.5 py-0.5 bg-paper-100 dark:bg-ink-800 border border-paper-200 dark:border-ink-700 rounded-full text-xs hover:bg-paper-200 dark:hover:bg-ink-700 transition-colors"
              >
                {emoji} {count > 1 && <span className="text-ink-500 font-medium">{count}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hover actions */}
      {showActions && (
        <div className={`flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity mb-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker((s) => !s)}
              className="p-1.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-paper-200 dark:hover:text-paper-50 dark:hover:bg-ink-700 transition-colors text-base"
            >
              😊
            </button>
            {showEmojiPicker && (
              <div className={`absolute bottom-full mb-1 flex gap-1 p-2 bg-white dark:bg-ink-800 border border-paper-200 dark:border-ink-700 rounded-xl shadow-xl z-20 ${isMine ? "right-0" : "left-0"}`}>
                {EMOJI_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => { onReact?.(message._id, emoji); setShowEmojiPicker(false); }}
                    className="text-lg hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onReply?.(message)}
            className="p-1.5 rounded-lg text-ink-400 hover:text-ink-900 hover:bg-paper-200 dark:hover:text-paper-50 dark:hover:bg-ink-700 transition-colors"
          >
            <Reply size={14} />
          </button>
          {isMine && (
            <button
              onClick={() => onDelete?.(message._id)}
              className="p-1.5 rounded-lg text-ink-400 hover:text-coral-500 hover:bg-coral-500/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
