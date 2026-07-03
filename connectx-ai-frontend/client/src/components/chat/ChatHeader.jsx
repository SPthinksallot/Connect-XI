import React, { useState } from "react";
import { ArrowLeft, Phone, Video, MoreVertical, Sparkles, BookOpen, Users } from "lucide-react";
import Avatar from "../common/Avatar";
import { formatLastSeen } from "../../utils/formatTime";
import useChatStore from "../../store/useChatStore";
import useAuthStore from "../../store/useAuthStore";
import SummarizeModal from "../ai/SummarizeModal";
import GroupInfo from "../group/GroupInfo";

export default function ChatHeader({ chat, onBack }) {
  const { onlineUserIds, activeChatType, typingUsers, activeChatId } = useChatStore();
  const { user } = useAuthStore();
  const [showSummarize, setShowSummarize] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isGroup = activeChatType === "Group";
  const other = isGroup
    ? null
    : chat?.participants?.find((p) => (p._id || p.toString()) !== user?._id);

  const name = isGroup ? chat?.name : (other?.displayName || other?.username || "");
  const avatar = isGroup ? chat?.avatar : other?.avatar;
  const isOnline = !isGroup && onlineUserIds.has(other?._id?.toString());

  const chatTyping = typingUsers[activeChatId] || {};
  const typingNames = Object.values(chatTyping);
  const isTyping = typingNames.length > 0;

  let statusText = "";
  if (isTyping) {
    statusText = typingNames.length === 1
      ? `${typingNames[0]} is typing…`
      : `${typingNames.length} people typing…`;
  } else if (isGroup) {
    statusText = `${chat?.members?.length || 0} members`;
  } else if (isOnline) {
    statusText = "Online";
  } else if (other?.lastSeen) {
    statusText = `Last seen ${formatLastSeen(other.lastSeen)}`;
  }

  return (
    <>
      <header className="flex items-center gap-3 px-5 py-4 border-b border-paper-200 dark:border-ink-800/50 bg-paper-100/80 dark:bg-ink-900/40 backdrop-blur-md shrink-0 transition-colors duration-300">
        {/* Back button (mobile) */}
        <button onClick={onBack} className="md:hidden p-2 rounded-xl text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-paper-50 hover:bg-paper-200 dark:hover:bg-ink-800/50 transition-all duration-200">
          <ArrowLeft size={20} />
        </button>

        {/* Avatar + name */}
        <button
          onClick={() => isGroup && setShowGroupInfo(true)}
          className="flex items-center gap-3 flex-1 min-w-0 text-left rounded-2xl p-2 hover:bg-paper-200/50 dark:hover:bg-ink-800/30 transition-all duration-200"
        >
          <Avatar name={name} src={avatar} size="sm" online={!isGroup ? isOnline : undefined} />
          <div className="min-w-0">
            <p className="font-bold text-ink-900 dark:text-paper-50 text-base truncate">{name}</p>
            <p className={`text-sm truncate transition-colors font-medium ${isTyping ? "text-violet-500 dark:text-violet-400" : "text-ink-500"}`}>
              {statusText}
            </p>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="summarize-chat-btn"
            onClick={() => setShowSummarize(true)}
            title="AI Summarize"
            className="p-2.5 rounded-xl text-ink-500 hover:text-violet-600 dark:text-ink-400 dark:hover:text-violet-400 hover:bg-violet-500/10 dark:hover:bg-violet-500/20 transition-all duration-200 shadow-sm"
          >
            <Sparkles size={19} />
          </button>
          {isGroup && (
            <button
              id="group-info-btn"
              onClick={() => setShowGroupInfo(true)}
              title="Group Info"
              className="p-2.5 rounded-xl text-ink-500 hover:text-ink-900 hover:bg-paper-200 dark:text-ink-400 dark:hover:text-paper-50 dark:hover:bg-ink-800/50 transition-all duration-200"
            >
              <Users size={19} />
            </button>
          )}
          <button
            className="p-2.5 rounded-xl text-ink-500 hover:text-ink-900 hover:bg-paper-200 dark:text-ink-400 dark:hover:text-paper-50 dark:hover:bg-ink-800/50 transition-all duration-200"
            title="Video Call (coming soon)"
          >
            <Video size={19} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu((s) => !s)}
              className="p-2.5 rounded-xl text-ink-500 hover:text-ink-900 hover:bg-paper-200 dark:text-ink-400 dark:hover:text-paper-50 dark:hover:bg-ink-800/50 transition-all duration-200"
            >
              <MoreVertical size={19} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-paper-50/95 dark:bg-ink-900/95 backdrop-blur-xl border border-paper-200 dark:border-ink-700/50 rounded-2xl shadow-2xl shadow-violet-500/10 z-30 py-2 overflow-hidden">
                {[
                  { label: "View Profile", icon: BookOpen },
                  { label: "Mute Notifications", icon: null },
                  { label: "Clear Chat", icon: null },
                ].map(({ label }) => (
                  <button
                    key={label}
                    onClick={() => setShowMenu(false)}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-ink-700 hover:bg-paper-200 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800/50 dark:hover:text-paper-50 transition-all duration-200"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {showSummarize && <SummarizeModal chatId={activeChatId} onClose={() => setShowSummarize(false)} />}
      {showGroupInfo && isGroup && <GroupInfo group={chat} onClose={() => setShowGroupInfo(false)} />}
    </>
  );
}
