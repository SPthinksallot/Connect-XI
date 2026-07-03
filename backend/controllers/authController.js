const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const { sendTokens, generateAccessToken } = require("../utils/generateToken");
const { sanitizeUser, asyncHandler, sendSuccess, sendError } = require("../utils/helpers");

// @desc   Register new user
// @route  POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 422);
  }

  const { username, email, password, displayName } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    if (existingUser.email === email) return sendError(res, "Email already registered", 409);
    return sendError(res, "Username already taken", 409);
  }

  const user = await User.create({ username, email, password, displayName: displayName || username });

  const { accessToken, refreshToken } = sendTokens(res, user);
  await User.findByIdAndUpdate(user._id, { refreshToken });

  sendSuccess(res, { user: sanitizeUser(user), accessToken }, 201, "Account created successfully");
});

// @desc   Login user
// @route  POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 422);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user || !(await user.comparePassword(password))) {
    return sendError(res, "Invalid email or password", 401);
  }

  const { accessToken, refreshToken } = sendTokens(res, user);
  user.refreshToken = refreshToken;
  user.status = "online";
  user.lastSeen = new Date();
  await user.save({ validateBeforeSave: false });

  sendSuccess(res, { user: sanitizeUser(user), accessToken }, 200, "Login successful");
});

// @desc   Refresh access token
// @route  POST /api/auth/refresh
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return sendError(res, "No refresh token", 401);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    return sendError(res, "Invalid or expired refresh token", 401);
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    return sendError(res, "Refresh token mismatch", 401);
  }

  const accessToken = generateAccessToken(user._id);
  sendSuccess(res, { accessToken });
});

// @desc   Logout
// @route  POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null, status: "offline", lastSeen: new Date() });
  }
  res.clearCookie("refreshToken");
  sendSuccess(res, null, 200, "Logged out successfully");
});

// @desc   Get current user
// @route  GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: sanitizeUser(req.user) });
});

// @desc   Update profile
// @route  PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { displayName, bio, preferredLanguage } = req.body;
  const updates = {};
  if (displayName !== undefined) updates.displayName = displayName;
  if (bio !== undefined) updates.bio = bio;
  if (preferredLanguage !== undefined) updates.preferredLanguage = preferredLanguage;

  if (req.file) {
    updates.avatar = req.file.path;
    updates.avatarPublicId = req.file.filename;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  sendSuccess(res, { user: sanitizeUser(user) }, 200, "Profile updated");
});

// @desc   Save push subscription
// @route  POST /api/auth/push-subscribe
const savePushSubscription = asyncHandler(async (req, res) => {
  const { subscription } = req.body;
  await User.findByIdAndUpdate(req.user._id, { pushSubscription: subscription });
  sendSuccess(res, null, 200, "Push subscription saved");
});

// @desc   Search users by username
// @route  GET /api/auth/users?q=
const searchUsers = asyncHandler(async (req, res) => {
  const { q = "" } = req.query;
  if (!q.trim()) return sendSuccess(res, { users: [] });

  console.log(`🔍 Searching for: "${q}"`);

  const users = await User.find({
    $or: [
      { username: { $regex: q, $options: "i" } },
      { displayName: { $regex: q, $options: "i" } },
    ],
    _id: { $ne: req.user._id },
  })
    .select("username displayName avatar status lastSeen")
    .limit(15);

  console.log(`📋 Found ${users.length} users:`, users.map(u => ({ username: u.username, displayName: u.displayName })));

  sendSuccess(res, { users });
});

// @desc   Request OTP via Phone
// @route  POST /api/auth/request-otp
const requestOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;
  if (!phone) return sendError(res, "Phone number is required", 400);

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp, salt);

  // Expiry 5 mins from now
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  let user = await User.findOne({ phone });
  if (user) {
    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save({ validateBeforeSave: false });
  } else {
    // Generate a default random username for new accounts
    const tempUsername = `user_${Math.random().toString(36).substring(2, 8)}`;
    
    // Try to create user, if email duplicate error occurs, it means we need to drop old index
    try {
      user = await User.create({
        phone,
        username: tempUsername,
        displayName: tempUsername,
        otp: hashedOtp,
        otpExpires,
      });
    } catch (error) {
      // Handle duplicate email index error (code 11000)
      if (error.code === 11000 && error.message.includes('email')) {
        // Drop the old non-sparse email index and recreate it
        try {
          await User.collection.dropIndex('email_1');
          await User.collection.createIndex({ email: 1 }, { unique: true, sparse: true });
          console.log('✅ Fixed email index - now supports multiple null values');
          
          // Retry user creation
          user = await User.create({
            phone,
            username: tempUsername,
            displayName: tempUsername,
            otp: hashedOtp,
            otpExpires,
          });
        } catch (indexError) {
          console.error('Index fix error:', indexError);
          throw error; // Re-throw original error if fix fails
        }
      } else {
        throw error; // Re-throw if it's a different error
      }
    }
  }

  // MOCK MODE vs PRODUCTION TWILIO
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const twilio = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await twilio.messages.create({
        body: `Your ConnectX login code is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });
      console.log(`[Twilio] Sent OTP to ${phone}`);
    } catch (err) {
      console.error("[Twilio Error]", err);
      return sendError(res, "Failed to send SMS. Check Twilio credentials.", 500);
    }
  } else {
    // MOCK MODE
    console.log(`\n\n================================`);
    console.log(`📲 MOCK SMS SENT TO ${phone}`);
    console.log(`🔑 YOUR OTP IS: ${otp}`);
    console.log(`================================\n\n`);
  }

  sendSuccess(res, null, 200, "OTP sent successfully");
});

// @desc   Verify OTP and Login
// @route  POST /api/auth/verify-otp
const verifyOtp = asyncHandler(async (req, res) => {
  const { phone, otp, name } = req.body;
  if (!phone || !otp) return sendError(res, "Phone and OTP are required", 400);

  const user = await User.findOne({ phone }).select("+otp +otpExpires +refreshToken");
  if (!user) return sendError(res, "User not found", 404);

  if (!user.otp || !user.otpExpires) {
    return sendError(res, "No OTP requested", 400);
  }

  if (new Date() > user.otpExpires) {
    return sendError(res, "OTP has expired", 400);
  }

  const isMatch = await bcrypt.compare(otp, user.otp);
  if (!isMatch) {
    return sendError(res, "Invalid OTP", 401);
  }

  // Update user with name if provided (for new users)
  if (name && name.trim()) {
    user.displayName = name.trim();
    user.username = name.trim().toLowerCase().replace(/\s+/g, '_');
    console.log(`✏️  Updated user: username="${user.username}", displayName="${user.displayName}"`);
  }

  // Clear OTP
  user.otp = undefined;
  user.otpExpires = undefined;

  const { accessToken, refreshToken } = sendTokens(res, user);
  user.refreshToken = refreshToken;
  user.status = "online";
  user.lastSeen = new Date();
  await user.save({ validateBeforeSave: false });

  console.log(`✅ User logged in: ${user.username} (${user.displayName})`);

  sendSuccess(res, { user: sanitizeUser(user), accessToken }, 200, "Login successful");
});

module.exports = { register, login, refreshToken, logout, getMe, updateProfile, savePushSubscription, searchUsers, requestOtp, verifyOtp };
