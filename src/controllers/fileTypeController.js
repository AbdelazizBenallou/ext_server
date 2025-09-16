const FileType = require("../models/fileType");
const cache = require("../config/redis");
const Module = require("../models/module");

module.exports = {
  getAllFileTypes: async (req, res) => {
    try {
      const { moduleId } = req.params ?? {};
      const cacheKey = `fileTypes:${moduleId}`;
      const cacheTTL = 300000;

      if (!moduleId) {
        return res.status(400).json({
          success: false,
          message: "Module ID is required",
        });
      }
      const moduleIdInt = parseInt(moduleId, 10);
      if (isNaN(moduleIdInt) || moduleIdInt <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid Module ID",
        });
      }

      const moduleIdExists = await Module.findByPk(moduleIdInt);

      if (!moduleIdExists) {
        return res.status(404).json({
          success: false,
          message: "Module ID not found",
        });
      }

      const cached = await cache.get(cacheKey);
      if (cached) {
        return res.status(200).json({
          success: true,
          count: cached.data.length,
          data: cached.data,
          cache_hit: true,
          message: "Download link retrieved from cache",
        });
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

      await cache.set(cacheKey, { data: fileTypes }, cacheTTL);

      res.status(200).json({
        success: true,
        count: fileTypes.length,
        data: fileTypes,
        cache_hit: false,
        message: "File types retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching file types:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching file types",
      });
    }
  },
};
