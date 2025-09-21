const rateLimit = require("express-rate-limit");

const singleRequestPerHourLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "You can only make 1 request per hour",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const normalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const downloadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "📂 Too many downloads, please wait before trying again." },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later",
});

module.exports = {
  normalLimiter,
  downloadLimiter,
  singleRequestPerHourLimiter,
  loginLimiter,
};
