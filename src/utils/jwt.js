const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_JWT_SECRET;

module.exports = {
  generateAccessToken: (payload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
  },

  generateRefreshToken: (payload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "10m" });
  },

  verifyAccessToken: (token) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  },

  verifyRefreshToken: (token) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  },
};
