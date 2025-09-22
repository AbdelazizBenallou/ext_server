const FileType = require("../models/fileType");
const cacheService = require("../services/cache_ser");
const Module = require("../models/module");

const CACHE_TTL = 300000;

const fileTypeService = {
  getAllFileTypes: async (moduleId) => {
    if (!moduleId) {
      throw new Error("Module ID is required");
    }

    const moduleIdInt = Number(moduleId);
    if (!Number.isInteger(moduleIdInt) || moduleIdInt <= 0) {
      throw new Error("Invalid Module ID");
    }

    const cacheKey = `fileTypes:${moduleIdInt}`;

    const cached = await cacheService.get(cacheKey);
    if (cached && cacheService.shouldUseCache(cached)) {
      return {
        data: cached.data,
        count: cached.data.length,
        cacheHit: true,
        source: "cache",
      };
    }

    const moduleExists = await Module.findByPk(moduleIdInt);
    if (!moduleExists) {
      throw new Error("Module ID not found");
    }

    const fileTypes = await FileType.findAll({
      include: [
        {
          model: Module,
          where: { id: moduleIdInt },
          through: { attributes: [] },
          attributes: [],
          required: true,
        },
      ],
    });

    const cacheData = cacheService.buildCacheData(fileTypes, CACHE_TTL);
    await cacheService.set(cacheKey, cacheData, CACHE_TTL);

    return {
      data: fileTypes,
      count: fileTypes.length,
      cacheHit: false,
      source: "database",
    };
  },

  validateModuleId: (moduleId) => {
    const moduleIdInt = Number(moduleId);
    return Number.isInteger(moduleIdInt) && moduleIdInt > 0;
  },
};

module.exports = fileTypeService;