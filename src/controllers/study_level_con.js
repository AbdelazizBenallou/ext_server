const StudyLevel = require("../models/StudyLevel");
const cache = require("../config/redis");

module.exports = {
  getAll: async (req, res) => {
    const cacheKey = "study_level_all";
    const cacheTTL = 500;

    try {
      const cached = await cache.get(cacheKey);
      if (cached) {
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = cached.expires_at - now;

        if (timeLeft > 120) {
          return res.status(200).json({
            success: true,
            count: cached.data.length,
            data: cached.data,
            cache_hit: true,
            message: "Level link retrieved from cache",
          });
        }
      }

      // 2️⃣ Fetch from DB
      const levels = await StudyLevel.findAll();

      // 3️⃣ Store in cache with TTL
      await cache.set(
        cacheKey,
        {
          data: levels,
          expires_at: Math.floor(Date.now() / 1000) + cacheTTL,
        },
        cacheTTL
      );

      // 4️⃣ Return response
      res.status(200).json({
        success: true,
        count: levels.length,
        data: levels,
        cache_hit: false,
        message: "Levels link retrieved from database",
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

      const cacheKey = `study_level/${numericId}`;
      const cacheTTL = 300000;

      const cached = await cache.get(cacheKey);
      if (cached) {
        return res.status(200).json({
          success: true,
          count: Array.isArray(cached.data) ? cached.data.length : 1,
          data: cached.data,
          cache_hit: true,
          message: "Level retrieved from cache",
        });
      }

      const level = await StudyLevel.findByPk(numericId);
      if (!level) {
        return res.status(404).json({
          success: false,
          message: "Study level not found",
        });
      }

      await cache.set(cacheKey, { data: level }, cacheTTL);

      res.status(200).json({
        success: true,
        data: level,
        cache_hit: false,
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
