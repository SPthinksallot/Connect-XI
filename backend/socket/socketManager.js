const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const Group = require("../models/Group");
const EVENTS = require("./socketEvents");

let io;
// Map of userId -> socketId
const onlineUsers = new Map();

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // ─── JWT Authentication Middleware ────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
      if (!token) return next(new Error("Authentication error: no token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("username displayName avatar status");
      if (!user) return next(new Error("Authentication error: user not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on(EVENTS.CONNECTION, async (socket) => {
    const userId = socket.user._id.toString();
    console.log(`🔌 Socket connected: ${socket.user.username} (${socket.id})`);

    // Register user as online
    onlineUsers.set(userId, socket.id);
    global.userSocketMap = Object.fromEntries(onlineUsers);

    await User.findByIdAndUpdate(userId, { status: "online" });

    // Join all their chat & group rooms
    const [chats, groups] = await Promise.all([
      Chat.find({ participants: userId, isActive: true }).select("_id"),
      Group.find({ members: userId, isActive: true }).select("_id"),
    ]);

    const chatIds = chats.map(c => c._id.toString());
    const groupIds = groups.map(g => g._id.toString());
    
    chats.forEach((c) => socket.join(c._id.toString()));
    groups.forEach((g) => socket.join(g._id.toString()));

    console.log(`📍 User ${socket.user.username} joined rooms:`, [...chatIds, ...groupIds]);

    // Broadcast presence
    socket.broadcast.emit(EVENTS.USER_ONLINE, { userId });

    // ─── Typing events ───────────────────────────────────────────────────
    socket.on(EVENTS.TYPING_START, ({ chatId }) => {
      socket.to(chatId).emit(EVENTS.TYPING_STARTED, {
        chatId,
        userId,
        username: socket.user.displayName || socket.user.username,
      });
    });

    socket.on(EVENTS.TYPING_STOP, ({ chatId }) => {
      socket.to(chatId).emit(EVENTS.TYPING_STOPPED, { chatId, userId });
    });

    // ─── Message delivery ────────────────────────────────────────────────
    socket.on(EVENTS.MESSAGE_DELIVERED, async ({ messageId }) => {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { $set: { status: "delivered" } },
        { new: true }
      );
      if (message) {
        io.to(message.chatId.toString()).emit(EVENTS.MESSAGE_STATUS, {
          messageId,
          status: "delivered",
        });
      }
    });

    socket.on(EVENTS.MESSAGE_READ, async ({ messageId, chatId }) => {
      await Message.findByIdAndUpdate(messageId, { status: "read" });
      socket.to(chatId).emit(EVENTS.MESSAGE_STATUS, { messageId, status: "read" });

      // Reset unread count
      await Chat.findByIdAndUpdate(chatId, {
        [`unreadCount.${userId}`]: 0,
      });
    });

    // ─── Group room management ───────────────────────────────────────────
    socket.on(EVENTS.GROUP_JOIN, ({ groupId }) => {
      socket.join(groupId);
    });

    socket.on(EVENTS.GROUP_LEAVE, ({ groupId }) => {
      socket.leave(groupId);
    });

    // ─── Disconnect ──────────────────────────────────────────────────────
    socket.on(EVENTS.DISCONNECT, async () => {
      console.log(`🔌 Disconnected: ${socket.user.username}`);
      onlineUsers.delete(userId);
      global.userSocketMap = Object.fromEntries(onlineUsers);

      const lastSeen = new Date();
      await User.findByIdAndUpdate(userId, { status: "offline", lastSeen });
      socket.broadcast.emit(EVENTS.USER_OFFLINE, { userId, lastSeen });
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

const getOnlineUsers = () => onlineUsers;

module.exports = { initSocket, getIO, getOnlineUsers };
