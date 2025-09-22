const fileTypeService = require("../services/file_type");
const response = require("../utils/response");

module.exports = {
  getAllFileTypes: async (req, res) => {
    try {
      const { moduleId } = req.params ?? {};

      if (!moduleId) {
        return response.badRequestResponse(res, "Module ID is required");
      }

      if (!fileTypeService.validateModuleId(moduleId)) {
        return response.badRequestResponse(res, "Invalid Module ID");
      }

      const result = await fileTypeService.getAllFileTypes(moduleId);

      const message = result.cacheHit
        ? "File types retrieved from cache"
        : "File types retrieved successfully";

      response.successResponse(
        res,
        {
          count: result.count,
          data: result.data,
          cache_hit: result.cacheHit,
          source: result.source,
        },
        message,
        200
      );
    } catch (error) {
      console.error("Error fetching file types:", error);

      if (error.message.includes("not found")) {
        response.notFoundResponse(res, error.message);
      } else if (
        error.message.includes("required") ||
        error.message.includes("Invalid")
      ) {
        response.badRequestResponse(res, error.message);
      } else {
        response.errorResponse(
          res,
          "An error occurred while fetching file types",
          500
        );
      }
    }
  },
};
