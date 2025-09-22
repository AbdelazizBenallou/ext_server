const Semester = require("../models/semester");
const cacheService = require("../services/cache_ser");
const StudyLevel = require("../models/StudyLevel");

const CACHE_TTL = 500000;

const semesterService = {
  getAllSemesters: async (study_level_id) => {
    const studyLevelId = Number(study_level_id);

    if (!Number.isInteger(studyLevelId)) {
      throw new Error("Invalid ID: must be an integer");
    }
    const CACHE_KEY_Semsetrs = `study_level/${studyLevelId}/semesters`;

    const cached = await cacheService.get(CACHE_KEY_Semsetrs);
    if (cached && cacheService.shouldUseCache(cached)) {
      return {
        data: cached.data,
        cacheHit: true,
        source: "cache",
      };
    }
    const ExiststudyLevelId = await StudyLevel.findByPk(studyLevelId);
    if (!ExiststudyLevelId) {
      throw new Error("Invalid StudyYear Id");
    }

    const semesters = await Semester.findAll({
      where: { study_level_id: studyLevelId },
      order: [["start_date", "ASC"]],
    });

    const cacheData = cacheService.buildCacheData(semesters, CACHE_TTL);
    await cacheService.set(CACHE_KEY_Semsetrs, cacheData, CACHE_TTL);

    return {
      data: semesters,
      cacheHit: false,
      source: "database",
    };
  },
  validateId: (study_level_id) => {
    const numericId = Number(study_level_id);
    return Number.isInteger(numericId) && numericId >= 0 && numericId <= 10;
  },
};

module.exports = semesterService;
