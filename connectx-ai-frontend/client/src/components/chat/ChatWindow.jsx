import React, { useEffect, useRef, useState, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import Spinner from "../common/Spinner";
import useChatStore from "../../store/useChatStore";
import useAuthStore from "../../store/useAuthStore";
import useSocketStore from "../../store/useSocketStore";
import { messageApi } from "../../api/messageApi";
import { groupMessagesByDate } from "../../utils/formatTime";
import { EVENTS } from "../../utils/constants";

export default function ChatWindow() {
  const { user } = useAuthStore();
  const { socket } = useSocketStore();
  const {
    activeChatId, activeChatType, chats,
    messagesByChat, messagesLoading, hasMore,
    fetchMessages, deleteMessage, updateReactions, clearUnread, typingUsers,
  } = useChatStore();

  const [replyTo, setReplyTo] = useState(null);
  const bottomRef = useRef(null);
  const topRef = useRef(null);
  const containerRef = useRef(null);

  const messages = messagesByChat[activeChatId] || [];
  const grouped = groupMessagesByDate(messages);
  const chatTypingUsers = typingUsers[activeChatId] || {};
  const typingNames = Object.values(chatTypingUsers);

  const activeChat = chats.find((c) => c._id === activeChatId);

  // Initial load
  useEffect(() => {
    if (!activeChatId) return;
    if (!messagesByChat[activeChatId]) {
      fetchMessages(activeChatId, activeChatType);
    }
    clearUnread(activeChatId);
  }, [activeChatId, activeChatType]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Emit read receipt when focused
  useEffect(() => {
    if (!socket || !activeChatId || !messages.length) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender?._id !== user?._id && lastMsg.status !== "read") {
      socket.emit(EVENTS.MESSAGE_READ, { messageId: lastMsg._id, chatId: activeChatId });
    }
  }, [activeChatId, messages.length]);

  // Load more on scroll to top
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    if (containerRef.current.scrollTop < 60 && hasMore[activeChatId] && !messagesLoading) {
      const prevHeight = containerRef.current.scrollHeight;
      fetchMessages(activeChatId, activeChatType).then(() => {
        // Preserve scroll position
        const newHeight = containerRef.current?.scrollHeight || 0;
        if (containerRef.current) {
          containerRef.current.scrollTop = newHeight - prevHeight;
        }
      });
    }
  }, [activeChatId, activeChatType, hasMore, messagesLoading]);

  const handleDelete = async (messageId) => {
    try {
      await messageApi.deleteMessage(messageId);
      deleteMessage(activeChatId, messageId);
    } catch (err) { console.error(err); }
  };

  const handleReact = async (messageId, emoji) => {
    try {
      const { data } = await messageApi.reactToMessage(messageId, emoji);
      updateReactions(activeChatId, messageId, data.data.reactions);
    } catch (err) { console.error(err); }
  };

  if (!activeChatId) return null;

  return (
    <div className="flex flex-col h-full bg-transparent">
      <ChatHeader chat={activeChat} onBack={() => useChatStore.getState().setActiveChat(null)} />

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin py-4 space-y-1"
      >
        {/* Load more spinner */}
        {messagesLoading && (
          <div className="flex justify-center py-4">
            <Spinner size="sm" />
          </div>
        )}

        {grouped.map((item) => {
          if (item.type === "date") {
            return (
              <div key={item.key} className="flex items-center gap-3 px-6 py-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-paper-200 dark:via-ink-700/50 to-transparent" />
                <span className="text-xs text-ink-500 font-semibold whitespace-nowrap px-3 py-1.5 bg-paper-100 dark:bg-ink-800/40 rounded-full border border-paper-200 dark:border-ink-700/30 shadow-sm">
                  {item.label}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-paper-200 dark:via-ink-700/50 to-transparent" />
              </div>
            );
          }

          const msg = item.data;
          const senderId = (msg.sender?._id || msg.sender)?.toString();
          const myId = user?._id?.toString();
          const isMine = senderId === myId;
          const prevMsg = messages[messages.indexOf(msg) - 1];
          const showAvatar = !isMine && (
            !prevMsg || (prevMsg.sender?._id || prevMsg.sender) !== (msg.sender?._id || msg.sender)
          );

          return (
            <MessageBubble
              key={item.key}
              message={msg}
              isMine={isMine}
              showAvatar={showAvatar}
              onDelete={handleDelete}
              onReply={setReplyTo}
              onReact={handleReact}
            />
          );
        })}

        {/* Typing indicator */}
        <TypingIndicator names={typingNames} />
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        chatId={activeChatId}
        chatType={activeChatType}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}
