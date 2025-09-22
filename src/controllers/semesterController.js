const semesterService = require("../services/semester_ser_ser");
const response = require("../utils/response");

module.exports = {
  getSemesters: async (req, res) => {
    try {
      const { study_level_id } = req.params ?? {};
      console.log(study_level_id);
      if (!study_level_id) {
        return response.badRequestResponse(res, "StudyLevelID is required");
      }
      if (!semesterService.validateId(study_level_id)) {
        return response.badRequestResponse(res, "Invalid ID");
      }

      const semesters = await semesterService.getAllSemesters(study_level_id);
      response.successResponse(
        res,
        { data: semesters },
        "Study Semesters retrieved successfully",
        200
      );
    } catch (error) {
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
