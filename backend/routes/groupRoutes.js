const express = require("express");
const { createGroup, getGroup, updateGroup, addMembers, removeMember, deleteGroup } = require("../controllers/groupController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(protect);

router.post("/", createGroup);
router.get("/:groupId", getGroup);
router.put("/:groupId", upload.single("avatar"), updateGroup);
router.post("/:groupId/members", addMembers);
router.delete("/:groupId/members/:userId", removeMember);
router.delete("/:groupId", deleteGroup);

module.exports = router;
