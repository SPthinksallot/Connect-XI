const express = require("express");
const { searchMessages, searchUsers } = require("../controllers/searchController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/messages", searchMessages);
router.get("/users", searchUsers);

module.exports = router;
