const moduleService = require("../services/module_ser");
const response = require("../utils/response");

module.exports = {
  getModules: async (req, res) => {
    try {
      const { semesterId, specializationId } = req.params;

      if (!semesterId) {
        return response.badRequestResponse(res, "semesterId is required");
      }

      if (!moduleService.validateIds(semesterId, specializationId)) {
        return response.badRequestResponse(res, "Invalid ID(s)");
      }

      const result = await moduleService.getModules(
        semesterId,
        specializationId
      );

      response.successResponse(
        res,
        {
          count: result.count,
          data: result.data,
          source: result.source,
        },
        "Modules retrieved successfully",
        200
      );
    } catch (error) {
      console.error("Error fetching modules", error);

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
          "An error occurred while fetching modules",
          500
        );
      }
    }
  },
};
