/**
 * Pick safe fields from a user document for API responses.
 */
const sanitizeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio,
  status: user.status,
  lastSeen: user.lastSeen,
  createdAt: user.createdAt,
});

/**
 * Async wrapper to avoid try/catch boilerplate in controllers.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Standard API response helpers.
 */
const sendSuccess = (res, data, statusCode = 200, message = "Success") => {
  res.status(statusCode).json({ success: true, message, data });
};

const sendError = (res, message, statusCode = 400) => {
  res.status(statusCode).json({ success: false, message });
};

/**
 * Paginate a mongoose query using cursor-based pagination.
 */
const paginateQuery = async (Model, query, options = {}) => {
  const { limit = 30, before } = options;
  const filter = { ...query };

  if (before) {
    filter._id = { $lt: before };
  }

  const docs = await Model.find(filter)
    .sort({ _id: -1 })
    .limit(limit + 1);

  const hasMore = docs.length > limit;
  if (hasMore) docs.pop();

  return {
    docs: docs.reverse(),
    hasMore,
    nextCursor: hasMore ? docs[0]._id : null,
  };
};

module.exports = { sanitizeUser, asyncHandler, sendSuccess, sendError, paginateQuery };
