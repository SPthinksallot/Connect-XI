import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";
import useSocketStore from "../store/useSocketStore";
import { EVENTS, SOCKET_URL } from "../utils/constants";

export const useSocket = () => {
  const { accessToken, isAuthenticated } = useAuthStore();
  const { setSocket, clearSocket, setConnected } = useSocketStore();
  const {
    addMessage, updateMessageStatus, deleteMessage, updateReactions,
    setTyping, clearTyping, setUserOnline, setUserOffline, activeChatId,
  } = useChatStore();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    const socket = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;
    setSocket(socket);

    socket.on("connect", () => {
      setConnected(true);
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("🔌 Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setConnected(false);
    });

    // ─── Presence ─────────────────────────────────────────────────────────
    socket.on(EVENTS.USER_ONLINE, ({ userId }) => setUserOnline(userId));
    socket.on(EVENTS.USER_OFFLINE, ({ userId }) => setUserOffline(userId));

    // ─── Messages ─────────────────────────────────────────────────────────
    socket.on(EVENTS.MESSAGE_NEW, ({ message }) => {
      console.log('📩 New message received:', message);
      addMessage(message.chatId, message);
      // Emit delivery receipt if not the sender
      const myId = useAuthStore.getState().user?._id;
      if (message.sender?._id !== myId && message.chatId !== activeChatId) {
        socket.emit(EVENTS.MESSAGE_DELIVERED, { messageId: message._id });
      }
    });

    socket.on(EVENTS.MESSAGE_STATUS, ({ messageId, status }) => {
      const chatId = useChatStore.getState().activeChatId;
      if (chatId) updateMessageStatus(chatId, messageId, status);
    });

    socket.on(EVENTS.MESSAGE_DELETED, ({ messageId }) => {
      const chatId = useChatStore.getState().activeChatId;
      if (chatId) deleteMessage(chatId, messageId);
    });

    socket.on(EVENTS.MESSAGE_REACTED, ({ messageId, reactions }) => {
      const chatId = useChatStore.getState().activeChatId;
      if (chatId) updateReactions(chatId, messageId, reactions);
    });

    // ─── Typing ───────────────────────────────────────────────────────────
    socket.on(EVENTS.TYPING_STARTED, ({ chatId, userId, username }) => {
      setTyping(chatId, userId, username);
    });

    socket.on(EVENTS.TYPING_STOPPED, ({ chatId, userId }) => {
      clearTyping(chatId, userId);
    });

    return () => {
      socket.disconnect();
      clearSocket();
    };
  }, [isAuthenticated, accessToken]);

  return socketRef.current;
};
