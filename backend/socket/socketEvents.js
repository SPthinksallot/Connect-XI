// ─── Connection ──────────────────────────────────────────────────────────────
const CONNECTION = "connection";
const DISCONNECT = "disconnect";

// ─── User presence ───────────────────────────────────────────────────────────
const USER_ONLINE = "user:online";
const USER_OFFLINE = "user:offline";

// ─── Messaging ───────────────────────────────────────────────────────────────
const MESSAGE_SEND = "message:send";
const MESSAGE_NEW = "message:new";
const MESSAGE_STATUS = "message:status";
const MESSAGE_DELIVERED = "message:delivered";
const MESSAGE_READ = "message:read";
const MESSAGE_DELETE = "message:delete";
const MESSAGE_DELETED = "message:deleted";
const MESSAGE_REACT = "message:react";
const MESSAGE_REACTED = "message:reacted";

// ─── Typing ──────────────────────────────────────────────────────────────────
const TYPING_START = "typing:start";
const TYPING_STOP = "typing:stop";
const TYPING_STARTED = "typing:started";
const TYPING_STOPPED = "typing:stopped";

// ─── Groups ──────────────────────────────────────────────────────────────────
const GROUP_JOIN = "group:join";
const GROUP_LEAVE = "group:leave";
const GROUP_MEMBER_ADDED = "group:member:added";
const GROUP_MEMBER_REMOVED = "group:member:removed";
const GROUP_UPDATED = "group:updated";

// ─── Notifications ───────────────────────────────────────────────────────────
const NOTIFICATION_NEW = "notification:new";

// ─── Errors ──────────────────────────────────────────────────────────────────
const SOCKET_ERROR = "socket:error";

module.exports = {
  CONNECTION, DISCONNECT,
  USER_ONLINE, USER_OFFLINE,
  MESSAGE_SEND, MESSAGE_NEW, MESSAGE_STATUS, MESSAGE_DELIVERED,
  MESSAGE_READ, MESSAGE_DELETE, MESSAGE_DELETED, MESSAGE_REACT, MESSAGE_REACTED,
  TYPING_START, TYPING_STOP, TYPING_STARTED, TYPING_STOPPED,
  GROUP_JOIN, GROUP_LEAVE, GROUP_MEMBER_ADDED, GROUP_MEMBER_REMOVED, GROUP_UPDATED,
  NOTIFICATION_NEW, SOCKET_ERROR,
};
