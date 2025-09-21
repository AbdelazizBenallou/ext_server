const jwtUtil = require("../utils/jwt");
const response = require("../utils/response");

module.exports = {
  authenticate: (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return response.unauthorizedResponse(
          res,
          "Authorization header missing or malformed"
        );
      }

      const token = authHeader.split(" ")[1];
      const payload = jwtUtil.verifyAccessToken(token);

      req.user = payload;
      next();
    } catch (err) {
      return response.unauthorizedResponse(res, "Invalid or expired token");
    }
  },
};
