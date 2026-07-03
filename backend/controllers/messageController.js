const Message = require("../models/Message");
const Chat = require("../models/Chat");
const Group = require("../models/Group");
const { asyncHandler, sendSuccess, sendError, paginateQuery } = require("../utils/helpers");
const { getIO, getOnlineUsers } = require("../socket/socketManager");
const EVENTS = require("../socket/socketEvents");

// @desc   Get messages for a chat (cursor-based pagination)
// @route  GET /api/messages/:chatId?type=Chat|Group&before=<cursor>
const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { type = "Chat", before, limit = 30 } = req.query;

  const { docs, hasMore, nextCursor } = await paginateQuery(
    Message,
    { chatId, chatType: type, isDeleted: false },
    { limit: parseInt(limit), before }
  );

  const messages = await Message.populate(docs, [
    { path: "sender", select: "username displayName avatar" },
    { path: "replyTo", select: "content sender mediaType", populate: { path: "sender", select: "username displayName" } },
  ]);

  sendSuccess(res, { messages, hasMore, nextCursor });
});

// @desc   Send a text message
// @route  POST /api/messages/:chatId
const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { content, chatType = "Chat", replyTo } = req.body;

  if (!content?.trim()) return sendError(res, "Message content is required", 400);

  // Verify participant
  const Model = chatType === "Group" ? Group : Chat;
  const conversation = await Model.findById(chatId);
  if (!conversation) return sendError(res, "Conversation not found", 404);

  const isMember =
    chatType === "Group"
      ? conversation.members.some((m) => m.toString() === req.user._id.toString())
      : conversation.participants.some((p) => p.toString() === req.user._id.toString());

  if (!isMember) return sendError(res, "Not a member of this conversation", 403);

  const message = await Message.create({
    chatId,
    chatType,
    sender: req.user._id,
    content: content.trim(),
    replyTo: replyTo || null,
  });

  // Update lastMessage & unreadCount
  const otherIds =
    chatType === "Group"
      ? conversation.members.filter((m) => m.toString() !== req.user._id.toString())
      : conversation.participants.filter((p) => p.toString() !== req.user._id.toString());

  const unreadUpdate = {};
  const onlineUsers = getOnlineUsers();
  otherIds.forEach((id) => {
    const idStr = id.toString();
    if (!onlineUsers.has(idStr)) {
      const current = conversation.unreadCount?.get?.(idStr) || 0;
      unreadUpdate[`unreadCount.${idStr}`] = current + 1;
    }
  });

  await Model.findByIdAndUpdate(chatId, {
    lastMessage: message._id,
    updatedAt: new Date(),
    ...unreadUpdate,
  });

  const populated = await message.populate([
    { path: "sender", select: "username displayName avatar" },
    { path: "replyTo", select: "content sender", populate: { path: "sender", select: "username displayName" } },
  ]);

  // Broadcast via Socket.io
  const io = getIO();
  console.log(`📤 Broadcasting message to room ${chatId}:`, {
    messageId: populated._id,
    sender: populated.sender?.username,
    content: populated.content.substring(0, 50)
  });
  io.to(chatId.toString()).emit(EVENTS.MESSAGE_NEW, { message: populated });

  sendSuccess(res, { message: populated }, 201);
});

// @desc   Send a media message
// @route  POST /api/messages/:chatId/media
const sendMediaMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { chatType = "Chat", content = "" } = req.body;

  if (!req.file) return sendError(res, "No file uploaded", 400);

  let mediaType = "file";
  const mime = req.file.mimetype;
  if (mime.startsWith("image/")) mediaType = "image";
  else if (mime.startsWith("video/")) mediaType = "video";
  else if (mime.startsWith("audio/")) mediaType = "audio";

  const message = await Message.create({
    chatId,
    chatType,
    sender: req.user._id,
    content,
    mediaUrl: req.file.path,
    mediaPublicId: req.file.filename,
    mediaType,
    mediaName: req.file.originalname,
  });

  const Model = chatType === "Group" ? Group : Chat;
  await Model.findByIdAndUpdate(chatId, { lastMessage: message._id, updatedAt: new Date() });

  const populated = await message.populate("sender", "username displayName avatar");

  const io = getIO();
  io.to(chatId.toString()).emit(EVENTS.MESSAGE_NEW, { message: populated });

  sendSuccess(res, { message: populated }, 201);
});

// @desc   Delete a message (soft delete)
// @route  DELETE /api/messages/:messageId
const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.messageId);
  if (!message) return sendError(res, "Message not found", 404);

  if (message.sender.toString() !== req.user._id.toString()) {
    return sendError(res, "Unauthorized", 403);
  }

  message.isDeleted = true;
  message.content = "";
  message.mediaUrl = null;
  await message.save();

  const io = getIO();
  io.to(message.chatId.toString()).emit(EVENTS.MESSAGE_DELETED, { messageId: message._id });

  sendSuccess(res, null, 200, "Message deleted");
});

// @desc   Add or toggle reaction
// @route  PUT /api/messages/:messageId/react
const reactToMessage = asyncHandler(async (req, res) => {
  const { emoji } = req.body;
  if (!emoji) return sendError(res, "Emoji is required", 400);

  const message = await Message.findById(req.params.messageId);
  if (!message) return sendError(res, "Message not found", 404);

  const existingIdx = message.reactions.findIndex(
    (r) => r.userId.toString() === req.user._id.toString() && r.emoji === emoji
  );

  if (existingIdx > -1) {
    message.reactions.splice(existingIdx, 1); // toggle off
  } else {
    // Remove any previous reaction by this user
    message.reactions = message.reactions.filter(
      (r) => r.userId.toString() !== req.user._id.toString()
    );
    message.reactions.push({ userId: req.user._id, emoji });
  }

  await message.save();

  const io = getIO();
  io.to(message.chatId.toString()).emit(EVENTS.MESSAGE_REACTED, {
    messageId: message._id,
    reactions: message.reactions,
  });

  sendSuccess(res, { reactions: message.reactions });
});

module.exports = { getMessages, sendMessage, sendMediaMessage, deleteMessage, reactToMessage };
