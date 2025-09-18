const argon2 = require("argon2");

const User = require("../models/user");
const Profile = require("../models/profile");
const StudyLevel = require("../models/StudyLevel");
const Specialization = require("../models/specializations");

const jwt = require("jsonwebtoken");

/**
 * POST /api/v1/login
 * Body: { email, password }
 * Returns: user info with profile, study level and specialization
 */

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body ?? {};

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const normalizedEmail = String(email).trim().toLowerCase();

      const user = await User.findOne({
        where: { email: normalizedEmail },
        attributes: ["id", "username", "email", "password_hash"],
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email",
        });
      }

      const valid = await argon2.verify(user.password_hash, password);
      if (!valid) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }

      const profile = await Profile.findOne({
        where: { user_id: user.id },
        include: [StudyLevel, Specialization],
      });

      const responseUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: profile ?? null,
      };

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: responseUser,
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
};
