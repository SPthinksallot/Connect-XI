// ─── API ─────────────────────────────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// ─── Socket Events ───────────────────────────────────────────────────────────
export const EVENTS = {
  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",
  MESSAGE_SEND: "message:send",
  MESSAGE_NEW: "message:new",
  MESSAGE_STATUS: "message:status",
  MESSAGE_DELIVERED: "message:delivered",
  MESSAGE_READ: "message:read",
  MESSAGE_DELETE: "message:delete",
  MESSAGE_DELETED: "message:deleted",
  MESSAGE_REACT: "message:react",
  MESSAGE_REACTED: "message:reacted",
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",
  TYPING_STARTED: "typing:started",
  TYPING_STOPPED: "typing:stopped",
  GROUP_JOIN: "group:join",
  GROUP_LEAVE: "group:leave",
  GROUP_MEMBER_ADDED: "group:member:added",
  GROUP_MEMBER_REMOVED: "group:member:removed",
  GROUP_UPDATED: "group:updated",
  NOTIFICATION_NEW: "notification:new",
};

// ─── Message types ───────────────────────────────────────────────────────────
export const MEDIA_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  FILE: "file",
};

// ─── Message status ──────────────────────────────────────────────────────────
export const MESSAGE_STATUS = {
  SENT: "sent",
  DELIVERED: "delivered",
  READ: "read",
};

// ─── Languages ───────────────────────────────────────────────────────────────
export const LANGUAGES = {
  EN: "en",
  HI: "hi",
};

// ─── Local storage keys ───────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "connectx_access_token",
  THEME: "connectx-theme",
};

// ─── Pagination ──────────────────────────────────────────────────────────────
export const MESSAGES_PER_PAGE = 30;

// ─── Voice recording ─────────────────────────────────────────────────────────
export const MAX_VOICE_DURATION = 120; // seconds

// ─── AI model  (used in display) ─────────────────────────────────────────────
export const AI_MODEL_DISPLAY = "GPT-4o Mini";
