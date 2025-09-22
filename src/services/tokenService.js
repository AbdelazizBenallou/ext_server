const jwtUtil = require("../utils/jwt");
const RefreshToken = require("../models/refresh_tokens");
const User = require("../models/user");
const LoginHistory = require("../models/login_history");
const argon2 = require("argon2");

module.exports = {
  createTokens: async (user, req) => {
    const payload = { id: user.id };

    const accessToken = jwtUtil.generateAccessToken(payload);
    const refreshToken = jwtUtil.generateRefreshToken(payload);

    const hashed = await argon2.hash(refreshToken);

    const expiresAt = new Date();
    const createdAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 7);
    createdAt.setDate(createdAt.getDate());

    await RefreshToken.update(
      { revoked: true },
      { where: { user_id: user.id, revoked: false } }
    );
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress ||
      null;
    const userAgent = req.headers["user-agent"] || null;
    const clientInfo = req.body.client_info || null;
    const deviceId = req.body.device_id || null;

    await RefreshToken.create({
      user_id: user.id,
      token_hash: hashed,
      expires_at: expiresAt,
    });

    await LoginHistory.create({
      user_id: user.id,
      created_at: createdAt,
      ip_address: ipAddress,
      user_agent: userAgent,
      client_info: clientInfo,
      device_id: deviceId,
    });

    return { accessToken, refreshToken };
  },

  refreshAccessToken: async (refreshToken) => {

    const tokens = await RefreshToken.findAll({
      where: {
        revoked: false,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    let stored;
    for (const t of tokens) {
      const match = await argon2.verify(t.token_hash, refreshToken);
      if (match) {
        stored = t;
        break;
      }
    }

    if (!stored) {
      throw new Error("Invalid or expired refresh token");
    }

    const payload = jwtUtil.verifyRefreshToken(refreshToken);

    const accessToken = jwtUtil.generateAccessToken({ id: payload.id });
    return accessToken;
  },
  
  revokeToken: async (refreshToken) => {
    const tokens = await RefreshToken.findAll({ where: { revoked: false } });

    for (const t of tokens) {
      const match = await argon2.verify(t.token_hash, refreshToken);
      if (match) {
        await t.update({ revoked: true });
        return;
      }
    }

    throw new Error("Invalid refresh token");
  },
};
