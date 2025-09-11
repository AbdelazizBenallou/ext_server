const SemesterModel = require("../models/semester");
const StudyLevelModel = require("../models/StudyLevel");
const cache = require("../config/redis");

module.exports = {
  getSemesters: async (req, res) => {
    try {
      const { study_level_id } = req.params ?? {};

      if (!study_level_id) {
        return res.status(400).json({
          success: false,
          message: "study_level_id is required",
        });
      }

      const idNumber = parseInt(study_level_id, 10);
      if (isNaN(idNumber)) {
        return res.status(400).json({
          success: false,
          message: "study_level_id must be a valid number",
        });
      }

      const studyLevelExists = await StudyLevelModel.findByPk(idNumber);
      if (!studyLevelExists) {
        return res.status(404).json({
          success: false,
          message: `Study level with id ${idNumber} not found`,
        });
      }

      const cacheKey = `study_level/${idNumber}/semesters`;
      const cacheTTL = 300000;
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

      const semesters = await SemesterModel.findAll({
        where: { study_level_id: idNumber },
        order: [["start_date", "ASC"]],
      });

      await cache.set(
        cacheKey,
        {
          data: semesters,
          expires_at: Math.floor(Date.now() / 1000) + cacheTTL,
        },
        cacheTTL
      );

      res.status(200).json({
        success: true,
        message: "Semesters retrieved successfully",
        data: semesters,
      });
    } catch (error) {
      console.error("Error fetching semesters", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching semesters",
      });
    }
  },
};
