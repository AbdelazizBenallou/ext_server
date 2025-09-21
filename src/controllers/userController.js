const response = require("../utils/response");
const UserService = require("../services/user_ser");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body ?? {};
      const user = await UserService.login(email, password);
      return response.successResponse(
        res,
        { data: user },
        "Login successful",
        200
      );
    } catch (err) {
      console.error("Login error:", err);
      return response.badRequestResponse(res, "Invalid credentials");
    }
  },
};
