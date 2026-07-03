const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require("../models/Message");
const { asyncHandler, sendSuccess, sendError } = require("../utils/helpers");

// @desc   Get all chats for the current user
// @route  GET /api/chats
const getChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({
    participants: req.user._id,
    isActive: true,
  })
    .populate("participants", "username displayName avatar status lastSeen")
    .populate({
      path: "lastMessage",
      select: "content mediaType mediaUrl sender createdAt isDeleted",
      populate: { path: "sender", select: "username displayName" },
    })
    .sort({ updatedAt: -1 });

  sendSuccess(res, { chats });
});

// @desc   Create or fetch 1-to-1 chat
// @route  POST /api/chats
const createOrGetChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) return sendError(res, "userId is required", 400);
  if (userId === req.user._id.toString()) return sendError(res, "Cannot chat with yourself", 400);

  const otherUser = await User.findById(userId);
  if (!otherUser) return sendError(res, "User not found", 404);

  // Check if chat already exists
  let chat = await Chat.findOne({
    participants: { $all: [req.user._id, userId], $size: 2 },
  })
    .populate("participants", "username displayName avatar status lastSeen")
    .populate("lastMessage");

  if (chat) return sendSuccess(res, { chat });

  // Create new chat
  chat = await Chat.create({
    participants: [req.user._id, userId],
    unreadCount: { [userId]: 0, [req.user._id]: 0 },
  });

  chat = await chat.populate("participants", "username displayName avatar status lastSeen");
  sendSuccess(res, { chat }, 201);
});

// @desc   Delete chat
// @route  DELETE /api/chats/:chatId
const deleteChat = asyncHandler(async (req, res) => {
  const chat = await Chat.findOne({
    _id: req.params.chatId,
    participants: req.user._id,
  });

  if (!chat) return sendError(res, "Chat not found", 404);

  chat.isActive = false;
  await chat.save();

  sendSuccess(res, null, 200, "Chat deleted");
});

module.exports = { getChats, createOrGetChat, deleteChat };
