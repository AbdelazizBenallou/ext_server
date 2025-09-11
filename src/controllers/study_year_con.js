const StudyYear = require("../models/StudyYear");
const cache = require("../config/redis");

module.exports = {
  getAll: async (req, res) => {
    const cacheKey = "study_years_all";
    const cacheTTL = 500;

    try {
      // 1️⃣ Try reading from cache
      const cached = await cache.get(cacheKey);
      if (cached) {
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = cached.expires_at - now;

        if (timeLeft > 120) {
          // Only use cache if more than 2 min left
          return res.status(200).json({
            success: true,
            count: cached.data.length,
            data: cached.data,
            cache_hit: true,
            message: "Download link retrieved from cache",
          });
        }
      }

      // 2️⃣ Fetch from DB
      const years = await StudyYear.findAll({
        order: [["id", "DESC"]],
      });

      // 3️⃣ Store in cache with TTL
      await cache.set(
        cacheKey,
        {
          data: years,
          expires_at: Math.floor(Date.now() / 1000) + cacheTTL,
        },
        cacheTTL
      );

      // 4️⃣ Return response
      res.status(200).json({
        success: true,
        count: years.length,
        data: years,
        cache_hit: false,
        message: "Download link retrieved from database",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const numericId = Number(id);
      if (!Number.isInteger(numericId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID: must be an integer",
        });
      }

      if (numericId < 1 || numericId > 10) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID: must be between 1 and 10",
        });
      }

      const year = await StudyYear.findByPk(numericId);
      if (!year) {
        return res.status(404).json({
          success: false,
          message: "Study year not found",
        });
      }

      res.status(200).json({
        success: true,
        data: year,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
};
