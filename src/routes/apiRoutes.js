const express = require("express");
const router = express.Router();

const limiter = require("../middlewere/rateLimiter");
const studyYearController = require("../controllers/study_year_con");
const studyLevelController = require("../controllers/study_level_con");
const userController = require("../controllers/userController");
const requestController = require("../controllers/requestController");
const semesterController = require("../controllers/semesterController");
const fileTypeController = require("../controllers/fileTypeController");
const moduleController = require("../controllers/moduleController");
const moduleFilesController = require("../controllers/modulefiles");
const { authenticate } = require("../middlewere/authMiddleware");

router.post("/v1/login", limiter.loginLimiter, userController.login);
router.post("/v1/refresh", userController.refresh);
router.post("/v1/logout", userController.logout);

router.post(
  "/v1/request",
  limiter.singleRequestPerHourLimiter,
  requestController.createRequest
);

router.get(
  "/v1/studyYear",
  authenticate,
  limiter.normalLimiter,
  studyYearController.getAll
);

router.get(
  "/v1/studyYear/:id",
  authenticate,
  limiter.normalLimiter,
  studyYearController.getById
);

router.get(
  "/v1/studyLevel/:study_level_id/semesters",
  authenticate,
  limiter.normalLimiter,
  semesterController.getSemesters
);

router.get(
  "/v1/modules/:moduleId/filesTypes",
  authenticate,
  limiter.normalLimiter,
  fileTypeController.getAllFileTypes
);

router.get(
  "/v1/semesters/:semesterId/modules",
  authenticate,
  limiter.normalLimiter,
  moduleController.getModules
);

router.get(
  "/v1/semesters/:semesterId/:specializationId/modules",
  authenticate,
  limiter.normalLimiter,
  moduleController.getModules
);

router.get(
  "/v1/studyYear/:studyYearId/modules/:moduleId/fileTypes/:fileTypeId/files",
  authenticate,
  moduleFilesController.getModuleFiles
);

router.get(
  "/v1/studyYear/:studyYearId/modules/:moduleId/fileTypes/:fileTypeId/files/:fileId/download",
  moduleFilesController.getModuleFileDownload
);

module.exports = router;
