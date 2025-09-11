const ModuleFilesModel = require("../models/moduleFiles");
const ModuleModel = require("../models/module");
const FileTypeModel = require("../models/fileType");
const cache = require("../config/redis");
const StudyYear = require("../models/StudyYear");

module.exports = {
  getModuleFiles: async (req, res) => {
    try {
      const { studyYearId, moduleId, fileTypeId } = req.params ?? {};

      if (!studyYearId || !moduleId || !fileTypeId) {
        return res.status(400).json({
          success: false,
          message: "studyYearId, moduleId and fileTypeId are required",
        });
      }

      const idStudyYear = parseInt(studyYearId, 10);
      const idModule = parseInt(moduleId, 10);
      const idFileType = parseInt(fileTypeId, 10);

      if (isNaN(idStudyYear) || isNaN(idModule) || isNaN(idFileType)) {
        return res.status(400).json({
          success: false,
          message: "studyYearId, moduleId and fileTypeId must be valid numbers",
        });
      }

      const studyYearExists = await StudyYear.findByPk(idStudyYear);
      if (!studyYearExists) {
        return res.status(404).json({
          success: false,
          message: `Study Year with id ${idStudyYear} not found`,
        });
      }
      const moduleExists = await ModuleModel.findByPk(idModule);
      if (!moduleExists) {
        return res.status(404).json({
          success: false,
          message: `Module with id ${idModule} not found`,
        });
      }
      const fileTypeExists = await FileTypeModel.findByPk(idFileType);
      if (!fileTypeExists) {
        return res.status(404).json({
          success: false,
          message: `File type with id ${idFileType} not found`,
        });
      }

      const cacheKey = `studyYear/${idStudyYear}/module/${idModule}/fileType/${idFileType}/files`;
      const cacheTTL = 300000;

      const cached = await cache.get(cacheKey);
      if (cached) {
        return res.status(200).json({
          success: true,
          count: cached.data.length,
          data: cached.data,
          cache_hit: true,
          message: "Module files retrieved from cache",
        });
      }

      const moduleFiles = await ModuleFilesModel.findAll({
        where: {
          study_year_id: idStudyYear,
          module_id: idModule,
          file_type_id: idFileType,
        },
      });
      await cache.set(
        cacheKey,
        {
          data: moduleFiles,
          expires_at: Math.floor(Date.now() / 1000) + cacheTTL,
        },
        cacheTTL
      );

      return res.status(200).json({
        success: true,
        count: moduleFiles.length,
        data: moduleFiles,
        cache_hit: false,
        message: "Module files retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching module files", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching module files",
      });
    }
  },
};
