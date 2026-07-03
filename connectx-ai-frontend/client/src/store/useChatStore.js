import { create } from "zustand";
import { chatApi } from "../api/chatApi";
import { messageApi } from "../api/messageApi";

const useChatStore = create((set, get) => ({
  // ─── Chats list ──────────────────────────────────────────────────────────
  chats: [],
  activeChatId: null,
  activeChatType: "Chat", // "Chat" | "Group"
  chatsLoading: false,

  // ─── Messages per chat ───────────────────────────────────────────────────
  messagesByChat: {}, // { chatId: [messages] }
  messagesLoading: false,
  hasMore: {},        // { chatId: boolean }
  cursors: {},        // { chatId: nextCursor }

  // ─── Typing ──────────────────────────────────────────────────────────────
  typingUsers: {},    // { chatId: { userId: username } }

  // ─── Online users ─────────────────────────────────────────────────────────
  onlineUserIds: new Set(),

  // ─── Search ──────────────────────────────────────────────────────────────
  searchQuery: "",
  searchResults: [],

  // ─── Unread ───────────────────────────────────────────────────────────────
  unreadCounts: {},

  // ─── Actions ─────────────────────────────────────────────────────────────
  setActiveChat: (chatId, chatType = "Chat") =>
    set({ activeChatId: chatId, activeChatType: chatType }),

  fetchChats: async () => {
    set({ chatsLoading: true });
    try {
      const { data } = await chatApi.getChats();
      const chats = data.data.chats;
      set({ chats, chatsLoading: false });
    } catch (err) {
      console.error("fetchChats error:", err);
      set({ chatsLoading: false });
    }
  },

  fetchMessages: async (chatId, chatType = "Chat") => {
    const { cursors, messagesByChat } = get();
    set({ messagesLoading: true });
    try {
      const { data } = await messageApi.getMessages(chatId, { type: chatType, before: cursors[chatId] });
      const { messages, hasMore, nextCursor } = data.data;
      set((state) => ({
        messagesByChat: {
          ...state.messagesByChat,
          [chatId]: [...messages, ...(state.messagesByChat[chatId] || [])],
        },
        hasMore: { ...state.hasMore, [chatId]: hasMore },
        cursors: { ...state.cursors, [chatId]: nextCursor },
        messagesLoading: false,
      }));
    } catch (err) {
      console.error("fetchMessages error:", err);
      set({ messagesLoading: false });
    }
  },

  addMessage: (chatId, message) => {
    set((state) => {
      const existing = state.messagesByChat[chatId] || [];
      // Avoid duplicates
      if (existing.some((m) => m._id === message._id)) return state;
      const updated = [...existing, message];

      // Update last message in chat list
      const chats = state.chats.map((c) => {
        const id = c._id || c.id;
        if (id === chatId) return { ...c, lastMessage: message, updatedAt: message.createdAt };
        return c;
      });
      // Sort by updatedAt
      chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      return {
        messagesByChat: { ...state.messagesByChat, [chatId]: updated },
        chats,
      };
    });
  },

  updateMessageStatus: (chatId, messageId, status) => {
    set((state) => ({
      messagesByChat: {
        ...state.messagesByChat,
        [chatId]: (state.messagesByChat[chatId] || []).map((m) =>
          m._id === messageId ? { ...m, status } : m
        ),
      },
    }));
  },

  deleteMessage: (chatId, messageId) => {
    set((state) => ({
      messagesByChat: {
        ...state.messagesByChat,
        [chatId]: (state.messagesByChat[chatId] || []).map((m) =>
          m._id === messageId ? { ...m, isDeleted: true, content: "" } : m
        ),
      },
    }));
  },

  updateReactions: (chatId, messageId, reactions) => {
    set((state) => ({
      messagesByChat: {
        ...state.messagesByChat,
        [chatId]: (state.messagesByChat[chatId] || []).map((m) =>
          m._id === messageId ? { ...m, reactions } : m
        ),
      },
    }));
  },

  setTyping: (chatId, userId, username) => {
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [chatId]: { ...(state.typingUsers[chatId] || {}), [userId]: username },
      },
    }));
  },

  clearTyping: (chatId, userId) => {
    set((state) => {
      const chatTyping = { ...(state.typingUsers[chatId] || {}) };
      delete chatTyping[userId];
      return { typingUsers: { ...state.typingUsers, [chatId]: chatTyping } };
    });
  },

  setUserOnline: (userId) => {
    set((state) => {
      const next = new Set(state.onlineUserIds);
      next.add(userId);
      return { onlineUserIds: next };
    });
  },

  setUserOffline: (userId) => {
    set((state) => {
      const next = new Set(state.onlineUserIds);
      next.delete(userId);
      return { onlineUserIds: next };
    });
  },

  addChat: (chat) => {
    set((state) => {
      const exists = state.chats.some((c) => c._id === chat._id);
      if (exists) return state;
      return { chats: [chat, ...state.chats] };
    });
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setSearchResults: (results) => set({ searchResults: results }),
  clearSearch: () => set({ searchQuery: "", searchResults: [] }),

  incrementUnread: (chatId) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [chatId]: (state.unreadCounts[chatId] || 0) + 1,
      },
    }));
  },

  clearUnread: (chatId) => {
    set((state) => ({ unreadCounts: { ...state.unreadCounts, [chatId]: 0 } }));
  },

  reset: () =>
    set({
      chats: [], activeChatId: null, messagesByChat: {}, typingUsers: {},
      onlineUserIds: new Set(), searchQuery: "", searchResults: [], unreadCounts: {},
    }),
}));

export default useChatStore;
