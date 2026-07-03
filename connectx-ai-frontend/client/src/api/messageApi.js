import api from "./authApi";

export const messageApi = {
  getMessages: (chatId, { type = "Chat", before, limit = 30 } = {}) =>
    api.get(`/messages/${chatId}`, { params: { type, before, limit } }),

  sendMessage: (chatId, { content, chatType = "Chat", replyTo }) =>
    api.post(`/messages/${chatId}`, { content, chatType, replyTo }),

  sendMedia: (chatId, formData) =>
    api.post(`/messages/${chatId}/media`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),

  reactToMessage: (messageId, emoji) => api.put(`/messages/${messageId}/react`, { emoji }),
};

export const searchApi = {
  searchMessages: (q, chatId, type) =>
    api.get("/search/messages", { params: { q, chatId, type } }),
  searchUsers: (q) => api.get("/search/users", { params: { q } }),
};

export const notificationApi = {
  getNotifications: () => api.get("/notifications"),
  markAllRead: () => api.put("/notifications/read-all"),
  markRead: (id) => api.put(`/notifications/${id}/read`),
};
