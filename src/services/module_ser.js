const Module = require("../models/module");
const Semester = require("../models/semester");
const SpecializationModule = require("../models/specialization_module");
const cacheService = require("../services/cache_ser");

const CACHE_TTL = 500000;

const moduleService = {
  getModules: async (semesterId, specializationId = null) => {
    if (!semesterId) {
      throw new Error("semesterId is required");
    }

    const cacheKey = specializationId
      ? `modules/semester/${semesterId}/specialization/${specializationId}`
      : `modules/semester/${semesterId}`;

    const cached = await cacheService.get(cacheKey);
    if (cached && cacheService.shouldUseCache(cached)) {
      return {
        data: cached.data,
        count: cached.data.length,
        cacheHit: true,
        source: "cache",
      };
    }

    const semester = await Semester.findByPk(semesterId);
    if (!semester) {
      throw new Error("Semester not found");
    }

    let modules;
    if (specializationId) {
      modules = await Module.findAll({
        where: { semester_id: semesterId },
        include: [
          {
            model: SpecializationModule,
            where: { specialization_id: specializationId },
            required: true,
          },
        ],
      });
    } else {
      modules = await Module.findAll({
        where: { semester_id: semesterId },
      });
    }

    const cacheData = cacheService.buildCacheData(modules, CACHE_TTL);
    await cacheService.set(cacheKey, cacheData, CACHE_TTL);

    return {
      data: modules,
      count: modules.length,
      cacheHit: false,
      source: "database",
    };
  },

  validateIds: (semesterId, specializationId = null) => {
    const numericSemesterId = Number(semesterId);
    if (!Number.isInteger(numericSemesterId) || numericSemesterId <= 0) {
      return false;
    }

    if (specializationId) {
      const numericSpecializationId = Number(specializationId);
      if (
        !Number.isInteger(numericSpecializationId) ||
        numericSpecializationId <= 0
      ) {
        return false;
      }
    }

    return true;
  },
};

module.exports = moduleService;
