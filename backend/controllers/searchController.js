const Message = require("../models/Message");
const User = require("../models/User");
const { asyncHandler, sendSuccess, sendError } = require("../utils/helpers");

// @desc   Semantic search across messages (MongoDB text index)
// @route  GET /api/search/messages?q=&chatId=&type=
const searchMessages = asyncHandler(async (req, res) => {
  const { q = "", chatId, type = "Chat", limit = 20 } = req.query;

  if (!q.trim()) return sendSuccess(res, { results: [] });

  const filter = {
    $text: { $search: q },
    isDeleted: false,
  };

  if (chatId) {
    filter.chatId = chatId;
    filter.chatType = type;
  }

  const results = await Message.find(filter, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" }, createdAt: -1 })
    .limit(parseInt(limit))
    .populate("sender", "username displayName avatar");

  sendSuccess(res, { results, count: results.length });
});

// @desc   Search users by username/displayName
// @route  GET /api/search/users?q=
const searchUsers = asyncHandler(async (req, res) => {
  const { q = "", limit = 15 } = req.query;

  if (!q.trim()) return sendSuccess(res, { users: [] });

  const users = await User.find({
    $or: [
      { username: { $regex: q, $options: "i" } },
      { displayName: { $regex: q, $options: "i" } },
    ],
    _id: { $ne: req.user._id },
  })
    .select("username displayName avatar status lastSeen")
    .limit(parseInt(limit));

  sendSuccess(res, { users });
});

module.exports = { searchMessages, searchUsers };
