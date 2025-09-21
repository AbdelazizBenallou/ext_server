const studyYearService = require("../services/study_year_ser");
const response = require("../utils/response"); // Your response helpers

module.exports = {
  getAll: async (req, res) => {
    try {
      const result = await studyYearService.getAll();

      const responseData = {
        count: result.data.length,
        data: result.data,
        cache_hit: result.cacheHit,
        message: `Data retrieved from ${result.source}`,
      };

      response.successResponse(res, responseData, responseData.message, 200);
    } catch (error) {
      console.error("Get all study years error:", error);
      response.errorResponse(res, "Server error", 500);
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!studyYearService.validateId(id)) {
        return response.badRequestResponse(
          res,
          "Invalid ID: must be an integer between 1 and 10"
        );
      }

      const year = await studyYearService.getById(id);
      response.successResponse(
        res,
        { data: year },
        "Study year retrieved successfully",
        200
      );
    } catch (error) {
      console.error("Get study year by ID error:", error);

      if (error.message.includes("not found")) {
        response.notFoundResponse(res, error.message);
      } else if (error.message.includes("Invalid ID")) {
        response.badRequestResponse(res, error.message);
      } else {
        response.errorResponse(res, "Server error", 500);
      }
    }
  },
};
