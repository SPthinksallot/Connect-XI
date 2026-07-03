const rateLimit = require("express-rate-limit");

// Disable rate limiting in development
const isDev = process.env.NODE_ENV === "development";

// Strict limiter for auth endpoints
const authLimiter = isDev ? (req, res, next) => next() : rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter
const globalLimiter = isDev ? (req, res, next) => next() : rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: { success: false, message: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI route limiter (more generous but still throttled)
const aiLimiter = isDev ? (req, res, next) => next() : rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: { success: false, message: "AI rate limit reached. Please wait a moment." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, globalLimiter, aiLimiter };
