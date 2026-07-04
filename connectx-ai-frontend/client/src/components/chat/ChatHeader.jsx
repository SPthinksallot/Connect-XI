import React, { useState } from "react";
import { ArrowLeft, Video, MoreVertical, Sparkles, BookOpen, Users, Phone } from "lucide-react";
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
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-[#E9E6DF] dark:border-[#2A2F45] bg-[#FFFFFF]/90 dark:bg-[#111318]/90 backdrop-blur-md shrink-0 transition-colors duration-300 relative z-20">
        
        {/* Left side: Back + User Info */}
        <div className="flex items-center gap-2">
          {/* Back button (mobile) */}
          <button onClick={onBack} className="md:hidden p-2 rounded-xl text-[#9AA0B8] hover:text-[#18192A] dark:hover:text-[#F0EEEA] hover:bg-[#F5F3EF] dark:hover:bg-[#222636] transition-all duration-200 shrink-0">
            <ArrowLeft size={20} />
          </button>

          {/* Avatar + name */}
          <button
            onClick={() => isGroup && setShowGroupInfo(true)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-2xl hover:bg-[#F5F3EF] dark:hover:bg-[#222636] transition-all duration-200 text-left"
          >
            <Avatar name={name} src={avatar} size="sm" online={!isGroup ? isOnline : undefined} />
            <div className="flex flex-col">
              <span className="font-display font-bold text-[15px] text-[#18192A] dark:text-[#F0EEEA] leading-tight truncate">
                {name}
              </span>
              <span className={`text-[12px] font-medium leading-tight mt-0.5 transition-colors
                ${isTyping ? "text-[#7C5CFF] animate-pulse" : isOnline ? "text-[#22D3A0]" : "text-[#9AA0B8] dark:text-[#5B6180]"}`}>
                {statusText}
              </span>
            </div>
          </button>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-1">
          <button
            id="summarize-chat-btn"
            onClick={() => setShowSummarize(true)}
            title="AI Summarize"
            className="w-10 h-10 flex items-center justify-center rounded-xl text-[#7C5CFF] hover:bg-[#7C5CFF]/10 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <Sparkles size={18} strokeWidth={2.5} />
          </button>
          
          {isGroup && (
            <button
              id="group-info-btn"
              onClick={() => setShowGroupInfo(true)}
              title="Group Info"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-[#9AA0B8] hover:text-[#18192A] dark:hover:text-[#F0EEEA] hover:bg-[#F5F3EF] dark:hover:bg-[#222636] transition-all duration-200"
            >
              <Users size={18} strokeWidth={2.5} />
            </button>
          )}

          <div className="w-px h-6 bg-[#E9E6DF] dark:bg-[#2A2F45] mx-1" />

          <button
            title="Voice Call"
            className="w-10 h-10 flex items-center justify-center rounded-xl text-[#9AA0B8] hover:text-[#18192A] dark:hover:text-[#F0EEEA] hover:bg-[#F5F3EF] dark:hover:bg-[#222636] transition-all duration-200"
          >
            <Phone size={18} strokeWidth={2.5} />
          </button>

          <button
            title="Video Call"
            className="w-10 h-10 flex items-center justify-center rounded-xl text-[#9AA0B8] hover:text-[#18192A] dark:hover:text-[#F0EEEA] hover:bg-[#F5F3EF] dark:hover:bg-[#222636] transition-all duration-200"
          >
            <Video size={18} strokeWidth={2.5} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu((s) => !s)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-[#9AA0B8] hover:text-[#18192A] dark:hover:text-[#F0EEEA] hover:bg-[#F5F3EF] dark:hover:bg-[#222636] transition-all duration-200"
            >
              <MoreVertical size={18} strokeWidth={2.5} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#1A1D27] border border-[#E9E6DF] dark:border-[#2A2F45] rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/50 z-30 py-2 animate-scale-in origin-top-right">
                {[
                  { label: "View Profile", icon: BookOpen },
                  { label: "Mute Notifications", icon: null },
                  { label: "Clear Chat", icon: null, danger: true },
                ].map(({ label, danger }) => (
                  <button
                    key={label}
                    onClick={() => setShowMenu(false)}
                    className={`w-full text-left px-4 py-2.5 text-[14px] font-medium transition-colors
                      ${danger 
                        ? "text-[#FF5C6B] hover:bg-[#FF5C6B]/10" 
                        : "text-[#18192A] dark:text-[#F0EEEA] hover:bg-[#F5F3EF] dark:hover:bg-[#222636]"
                      }`}
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
