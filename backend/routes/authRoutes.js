const express = require("express");
const { body } = require("express-validator");
const {
  register, login, refreshToken, logout, getMe, updateProfile, savePushSubscription, searchUsers, requestOtp, verifyOtp
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// Validation rules
const registerRules = [
  body("username").trim().isLength({ min: 3, max: 30 }).withMessage("Username must be 3-30 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerRules, register);
router.post("/login", loginRules, login);
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put("/profile", protect, upload.single("avatar"), updateProfile);
router.post("/push-subscribe", protect, savePushSubscription);
router.get("/users", protect, searchUsers);

module.exports = router;
