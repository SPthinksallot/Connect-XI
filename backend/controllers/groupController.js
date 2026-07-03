const Group = require("../models/Group");
const Message = require("../models/Message");
const { asyncHandler, sendSuccess, sendError } = require("../utils/helpers");
const { getIO } = require("../socket/socketManager");
const EVENTS = require("../socket/socketEvents");

// @desc   Create a group
// @route  POST /api/groups
const createGroup = asyncHandler(async (req, res) => {
  const { name, description, memberIds } = req.body;

  if (!name?.trim()) return sendError(res, "Group name is required", 400);

  const members = [req.user._id, ...(memberIds || [])];
  const uniqueMembers = [...new Set(members.map(String))].slice(0, 100);

  const group = await Group.create({
    name: name.trim(),
    description: description || "",
    admin: req.user._id,
    admins: [req.user._id],
    members: uniqueMembers,
  });

  await group.populate("members", "username displayName avatar status");
  await group.populate("admin", "username displayName avatar");

  // Join the socket room for all online members
  const io = getIO();
  uniqueMembers.forEach((memberId) => {
    const socketId = global.userSocketMap?.[memberId.toString()];
    if (socketId) {
      const socket = io.sockets.sockets.get(socketId);
      socket?.join(group._id.toString());
    }
  });

  sendSuccess(res, { group }, 201, "Group created");
});

// @desc   Get group details
// @route  GET /api/groups/:groupId
const getGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.groupId)
    .populate("members", "username displayName avatar status lastSeen")
    .populate("admin", "username displayName avatar");

  if (!group) return sendError(res, "Group not found", 404);
  if (!group.members.some((m) => m._id.toString() === req.user._id.toString())) {
    return sendError(res, "Not a member of this group", 403);
  }

  sendSuccess(res, { group });
});

// @desc   Update group info
// @route  PUT /api/groups/:groupId
const updateGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.groupId);
  if (!group) return sendError(res, "Group not found", 404);

  const isAdmin = group.admins.some((a) => a.toString() === req.user._id.toString());
  if (!isAdmin) return sendError(res, "Only admins can update the group", 403);

  const { name, description } = req.body;
  if (name !== undefined) group.name = name.trim();
  if (description !== undefined) group.description = description;
  if (req.file) {
    group.avatar = req.file.path;
    group.avatarPublicId = req.file.filename;
  }

  await group.save();
  await group.populate("members", "username displayName avatar status");

  const io = getIO();
  io.to(group._id.toString()).emit(EVENTS.GROUP_UPDATED, { group });

  sendSuccess(res, { group }, 200, "Group updated");
});

// @desc   Add members to group
// @route  POST /api/groups/:groupId/members
const addMembers = asyncHandler(async (req, res) => {
  const { memberIds } = req.body;
  const group = await Group.findById(req.params.groupId);
  if (!group) return sendError(res, "Group not found", 404);

  const isAdmin = group.admins.some((a) => a.toString() === req.user._id.toString());
  if (!isAdmin) return sendError(res, "Only admins can add members", 403);

  const newMembers = memberIds.filter(
    (id) => !group.members.some((m) => m.toString() === id)
  );

  group.members.push(...newMembers);
  await group.save();
  await group.populate("members", "username displayName avatar status");

  const io = getIO();
  io.to(group._id.toString()).emit(EVENTS.GROUP_MEMBER_ADDED, { groupId: group._id, members: group.members });

  sendSuccess(res, { group }, 200, "Members added");
});

// @desc   Remove member from group
// @route  DELETE /api/groups/:groupId/members/:userId
const removeMember = asyncHandler(async (req, res) => {
  const { groupId, userId } = req.params;
  const group = await Group.findById(groupId);
  if (!group) return sendError(res, "Group not found", 404);

  const isAdmin = group.admins.some((a) => a.toString() === req.user._id.toString());
  const isSelf = userId === req.user._id.toString();
  if (!isAdmin && !isSelf) return sendError(res, "Unauthorized", 403);

  group.members = group.members.filter((m) => m.toString() !== userId);
  group.admins = group.admins.filter((a) => a.toString() !== userId);
  await group.save();

  const io = getIO();
  io.to(groupId).emit(EVENTS.GROUP_MEMBER_REMOVED, { groupId, userId });

  sendSuccess(res, null, 200, isSelf ? "You left the group" : "Member removed");
});

// @desc   Delete group
// @route  DELETE /api/groups/:groupId
const deleteGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.groupId);
  if (!group) return sendError(res, "Group not found", 404);

  if (group.admin.toString() !== req.user._id.toString()) {
    return sendError(res, "Only the group creator can delete it", 403);
  }

  await Message.deleteMany({ chatId: group._id, chatType: "Group" });
  await group.deleteOne();

  sendSuccess(res, null, 200, "Group deleted");
});

module.exports = { createGroup, getGroup, updateGroup, addMembers, removeMember, deleteGroup };
