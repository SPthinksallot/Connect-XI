const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/helpers");

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendError(res, "Not authorized — no token provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -refreshToken");

    if (!user) {
      return sendError(res, "User no longer exists", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, "Token expired — please refresh", 401);
    }
    return sendError(res, "Invalid token", 401);
  }
};

module.exports = { protect };
