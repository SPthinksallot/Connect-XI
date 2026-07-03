const express = require("express");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");
const { asyncHandler, sendSuccess } = require("../utils/helpers");

const router = express.Router();

router.use(protect);

// GET /api/notifications
router.get("/", asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  sendSuccess(res, { notifications });
}));

// PUT /api/notifications/read-all
router.put("/read-all", asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
  sendSuccess(res, null, 200, "All notifications marked as read");
}));

// PUT /api/notifications/:id/read
router.put("/:id/read", asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { read: true });
  sendSuccess(res, null, 200, "Notification marked as read");
}));

module.exports = router;
