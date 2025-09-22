const StudyYear = require("../models/StudyYear");
const cacheService = require("./cache_ser");

const CACHE_KEY_YEARS = "study_years_all";
const CACHE_TTL = 500000;

const studyYearService = {
  getAll: async () => {
    const cached = await cacheService.get(CACHE_KEY_YEARS);
    if (cached && cacheService.shouldUseCache(cached)) {
      return {
        data: cached.data,
        cacheHit: true,
        source: "cache",
      };
    }

    const years = await StudyYear.findAll({
      order: [["id", "DESC"]],
    });

    const cacheData = cacheService.buildCacheData(years, CACHE_TTL);
    await cacheService.set(CACHE_KEY_YEARS, cacheData, CACHE_TTL);

    return {
      data: years,
      cacheHit: false,
      source: "database",
    };
  },

  getById: async (id) => {
    const numericId = Number(id);

    if (!Number.isInteger(numericId)) {
      throw new Error("Invalid ID: must be an integer");
    }

    if (numericId < 1 || numericId > 10) {
      throw new Error("Invalid resource identifier");
    }

    const CACHE_KEY_YEAR_ID = `studyYear/${id}`;

    const cached = await cacheService.get(CACHE_KEY_YEAR_ID);
    if (cached && cacheService.shouldUseCache(cached)) {
      return {
        data: cached.data,
        cacheHit: true,
        source: "cache",
      };
    }

    const year = await StudyYear.findByPk(numericId);
    if (!year) {
      throw new Error("Study year not found");
    }

    const cacheData = cacheService.buildCacheData(year, CACHE_TTL);
    await cacheService.set(CACHE_KEY_YEAR_ID, cacheData, CACHE_TTL);

    return {
      data: year,
      cacheHit: false,
      source: "database",
    };
  },

  validateId: (id) => {
    const numericId = Number(id);
    return Number.isInteger(numericId) && numericId >= 1 && numericId <= 7;
  },
};

module.exports = studyYearService;
