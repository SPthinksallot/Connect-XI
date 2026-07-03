const express = require("express");
const { getMessages, sendMessage, sendMediaMessage, deleteMessage, reactToMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(protect);

router.get("/:chatId", getMessages);
router.post("/:chatId", sendMessage);
router.post("/:chatId/media", upload.single("file"), sendMediaMessage);
router.delete("/:messageId", deleteMessage);
router.put("/:messageId/react", reactToMessage);

module.exports = router;
