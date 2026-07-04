import React from "react";
import Avatar from "../common/Avatar";
import { formatChatTime } from "../../utils/formatTime";
import { CheckCheck, Check, Image, Mic, FileText, Video } from "lucide-react";
import useChatStore from "../../store/useChatStore";

const MediaIcon = ({ type }) => {
  if (type === "image") return <Image size={13} />;
  if (type === "audio") return <Mic size={13} />;
  if (type === "video") return <Video size={13} />;
  return <FileText size={13} />;
};

export default function ChatListItem({ chat, isActive, onSelect, currentUserId }) {
  const { onlineUserIds } = useChatStore();

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

  // Sender prefix for groups
  const senderPrefix = isGroup && lastMsg && lastMsg.sender !== currentUserId && !lastMsg.isDeleted
    ? (lastMsg.sender?.displayName || lastMsg.sender?.username || "").split(" ")[0] + ": "
    : "";

  return (
    <button
      id={`chat-item-${chat._id}`}
      onClick={() => onSelect(chat._id, isGroup ? "Group" : "Chat")}
      className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl transition-all duration-200 text-left group
        ${isActive
          ? "bg-[#7C5CFF]/10 dark:bg-[#7C5CFF]/20 ring-1 ring-[#7C5CFF]/30 shadow-md shadow-[#7C5CFF]/5"
          : "hover:bg-[#F5F3EF] dark:hover:bg-[#1A1D27]"
        }`}
    >
      <Avatar
        name={name}
        src={avatar}
        size="md"
        online={!isGroup ? isOnline : undefined}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`font-semibold truncate text-[15px] transition-colors
            ${isActive
              ? "text-[#7C5CFF] dark:text-[#9B8FFF]"
              : "text-[#18192A] dark:text-[#F0EEEA] group-hover:text-black dark:group-hover:text-white"
            }`}>
            {name || "Unknown"}
          </span>
          <span className={`text-[11px] font-medium shrink-0 ml-2 transition-colors
            ${unread > 0 ? "text-[#7C5CFF]" : "text-[#9AA0B8] dark:text-[#5B6180]"}`}>
            {lastMsg ? formatChatTime(lastMsg.createdAt) : ""}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[13px] truncate">
            {previewIcon && <span className="text-[#9AA0B8] dark:text-[#5B6180]">{previewIcon}</span>}
            <span className={`truncate ${unread > 0 ? "text-[#18192A] dark:text-[#F0EEEA] font-medium" : "text-[#9AA0B8] dark:text-[#5B6180]"}`}>
              {senderPrefix && <span className="opacity-75 font-medium">{senderPrefix}</span>}
              {preview || "Start chatting"}
            </span>
          </div>
          {unread > 0 && (
            <span className="shrink-0 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-[#7C5CFF] to-[#FF5CAA] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md shadow-[#7C5CFF]/30 animate-scale-in">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
