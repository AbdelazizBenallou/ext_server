const UserService = require("../services/user_ser");
const TokenService = require("../services/tokenService");
const response = require("../utils/response");

const UserController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body ?? {};
      const user = await UserService.login(email, password);
      const { accessToken, refreshToken } = await TokenService.createTokens(
        user,
        req
      );
      return response.successResponse(
        res,
        {
          user,
          tokens: {
            accessToken,
            refreshToken,
          },
        },
        "Login successful",
        200
      );
    } catch (err) {
      return response.badRequestResponse(res, "Invalid credentials");
    }
  },

  refresh: async (req, res) => {
    try {
      const { refreshToken } = req.body ?? {};
      if (!refreshToken) {
        return response.badRequestResponse(res, "Refresh token required");
      }
      const accessToken = await TokenService.refreshAccessToken(refreshToken);

      return response.successResponse(
        res,
        { accessToken },
        "Access token refreshed",
        200
      );
    } catch (err) {
      return response.badRequestResponse(
        res,
        "Invalid or expired refresh token"
      );
    }
  },

  logout: async (req, res) => {
    try {
      const { refreshToken } = req.body ?? {};

      if (!refreshToken) {
        return response.badRequestResponse(res, "Refresh token required");
      }

      await TokenService.revokeToken(refreshToken);

      return response.successResponse(res, {}, "Logged out successfully", 200);
    } catch (err) {
      return response.badRequestResponse(res, "Invalid refresh token");
    }
  },
};

module.exports = UserController;
