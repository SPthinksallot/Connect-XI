const express = require("express");
const { getChats, createOrGetChat, deleteChat } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getChats);
router.post("/", createOrGetChat);
router.delete("/:chatId", deleteChat);

module.exports = router;
