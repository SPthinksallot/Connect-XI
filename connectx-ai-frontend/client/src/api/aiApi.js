import api from "./authApi";

export const aiApi = {
  /**
   * Get smart reply suggestions.
   * @param {Array<{senderName: string, content: string}>} messages - Last few messages
   */
  getSmartReplies: (messages) => api.post("/ai/smart-reply", { messages }),

  /**
   * Summarize a chat conversation.
   * @param {Array<{senderName: string, content: string}>} messages
   */
  summarizeChat: (messages) => api.post("/ai/summarize", { messages }),

  /**
   * Translate a message.
   * @param {string} text
   * @param {'en'|'hi'} targetLang
   */
  translateMessage: (text, targetLang) => api.post("/ai/translate", { text, targetLang }),
};
