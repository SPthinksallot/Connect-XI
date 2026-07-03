const express = require("express");
const { smartReply, summarizeChat, translateMessage } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");
const { aiLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.use(protect);
router.use(aiLimiter);

router.post("/smart-reply", smartReply);
router.post("/summarize", summarizeChat);
router.post("/translate", translateMessage);

module.exports = router;
