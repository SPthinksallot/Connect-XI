import React from "react";
import Avatar from "../common/Avatar";
import { formatChatTime } from "../../utils/formatTime";
import { CheckCheck, Check, Image, Mic, FileText, Video } from "lucide-react";
import useChatStore from "../../store/useChatStore";

const MediaIcon = ({ type }) => {
  if (type === "image") return <Image size={12} />;
  if (type === "audio") return <Mic size={12} />;
  if (type === "video") return <Video size={12} />;
  return <FileText size={12} />;
};

export default function ChatListItem({ chat, isActive, onSelect, currentUserId }) {
  const { onlineUserIds } = useChatStore();

  // Resolve the "other" participant for DMs or group info
  const isGroup = chat.chatType === "Group" || chat.isGroup;
  const other = isGroup
    ? null
    : chat.participants?.find((p) => (p._id || p) !== currentUserId);

  const name = isGroup ? chat.name : (other?.displayName || other?.username || "Unknown");
  const avatar = isGroup ? chat.avatar : other?.avatar;
  const isOnline = !isGroup && onlineUserIds.has(other?._id?.toString());
  const unread = chat.unreadCount?.get?.(currentUserId) || chat.unreadCount?.[currentUserId] || 0;

  const lastMsg = chat.lastMessage;
  let preview = "";
  let previewIcon = null;

  if (lastMsg) {
    if (lastMsg.isDeleted) {
      preview = "Message deleted";
    } else if (lastMsg.mediaType) {
      previewIcon = <MediaIcon type={lastMsg.mediaType} />;
      preview = lastMsg.mediaType.charAt(0).toUpperCase() + lastMsg.mediaType.slice(1);
    } else {
      preview = lastMsg.content || "";
    }
  }

  return (
    <button
      id={`chat-item-${chat._id}`}
      onClick={() => onSelect(chat._id, isGroup ? "Group" : "Chat")}
      className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-200 text-left group
        ${isActive
          ? "bg-violet-500/10 dark:bg-violet-500/20 ring-2 ring-violet-500/40 shadow-lg shadow-violet-500/10"
          : "hover:bg-paper-200 dark:hover:bg-ink-800/40"
        }`}
    >
      <Avatar
        name={name}
        src={avatar}
        size="md"
        online={!isGroup ? isOnline : undefined}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className={`font-semibold truncate text-base ${isActive ? "text-violet-600 dark:text-violet-300" : "text-ink-900 dark:text-paper-50 group-hover:text-ink-950 dark:group-hover:text-white"}`}>
            {name || "Unknown User"}
          </span>
          <span className="text-xs text-ink-500 shrink-0 ml-2 font-medium">
            {lastMsg ? formatChatTime(lastMsg.createdAt) : ""}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm text-ink-500 truncate">
            {previewIcon && <span className="text-ink-400">{previewIcon}</span>}
            <span className="truncate">{preview || "Start chatting"}</span>
          </div>
          {unread > 0 && (
            <span className="shrink-0 min-w-[22px] h-5 px-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-violet-500/30">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
