const Module = require("../models/module");
const Semester = require("../models/semester");
const SpecializationModule = require("../models/specialization_module");
module.exports = {
  getModules: async (req, res) => {
    try {
      const { semesterId, specializationId } = req.params;

      if (!semesterId) {
        return res.status(400).json({
          success: false,
          message: "semesterId is required",
        });
      }

      const semester = await Semester.findByPk(semesterId);
      if (!semester) {
        return res.status(404).json({
          success: false,
          message: "Semester not found",
        });
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

      return res.status(200).json({
        success: true,
        count: modules.length,
        data: modules,
      });
    } catch (error) {
      console.error("Error fetching modules", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching modules",
      });
    }
  },
};
