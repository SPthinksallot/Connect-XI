import api from "./authApi";

export const chatApi = {
  getChats: () => api.get("/chats"),
  createOrGetChat: (userId) => api.post("/chats", { userId }),
  deleteChat: (chatId) => api.delete(`/chats/${chatId}`),
};

export const groupApi = {
  createGroup: (data) => api.post("/groups", data),
  getGroup: (groupId) => api.get(`/groups/${groupId}`),
  updateGroup: (groupId, formData) =>
    api.put(`/groups/${groupId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  addMembers: (groupId, memberIds) => api.post(`/groups/${groupId}/members`, { memberIds }),
  removeMember: (groupId, userId) => api.delete(`/groups/${groupId}/members/${userId}`),
  deleteGroup: (groupId) => api.delete(`/groups/${groupId}`),
};
