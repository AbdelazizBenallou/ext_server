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

      // Basic validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Normalize email
      const normalizedEmail = String(email).trim().toLowerCase();

      // Find user with related profile -> study level and specialization
      const user = await User.findOne({
        where: { email: normalizedEmail },
        attributes: [
          "id",
          "username",
          "email",
          "password_hash",
        ],
        include: {
          model: Profile,
          include: [StudyLevel, Specialization],
        },
      });

      // Do not reveal whether email or password specifically failed
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Verify password with argon2
      const valid = await argon2.verify(user.password_hash, password);
      if (!valid) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }


      // Update last_login
      user.last_login = new Date();
      await user.save();

      // Prepare response (exclude password_hash)
      const responseUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: user.Profile ?? null,  
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
