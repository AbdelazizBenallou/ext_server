const rateLimit = require("express-rate-limit");

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
  message: { error: "📂 Too many downloads, please wait before trying again." }
});

module.exports = { normalLimiter, downloadLimiter };
