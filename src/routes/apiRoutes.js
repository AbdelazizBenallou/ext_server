const express = require("express");
const app = express();
const router = express.Router();

const limiter = require("../middlewere/rateLimiter");
const studyYearController = require("../controllers/study_year_con");
const studyLevelController = require("../controllers/study_level_con");
const userController = require("../controllers/userController");
const requestController = require("../controllers/requestController");
const semesterController = require("../controllers/semesterController");
const fileTypeController = require("../controllers/fileTypeController");

router.post("/v1/login", userController.login);

router.post(
  "/v1/request",
  limiter.singleRequestPerHourLimiter,
  requestController.createRequest
);

router.get("/v1/studyYear", studyYearController.getAll);
router.get("/v1/studyYear/:id", studyYearController.getById);

router.get("/v1/studyLevel", studyLevelController.getAll);
router.get("/v1/studyLevel/:id", studyLevelController.getById);

router.get(
  "/v1/studyLevel/:study_level_id/semesters",
  semesterController.getSemesters
);

router.get("/v1/modules/filesTypes", fileTypeController.getAllFileTypes);

module.exports = router;
