const FileType = require("../models/fileType");
const cache = require("../config/redis");

module.exports = {
  getAllFileTypes: async (req, res) => {
    const cacheKey = "module_file_types";
    const cacheTTL = 300000;

    try {
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

      const fileTypes = await FileType.findAll();
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
