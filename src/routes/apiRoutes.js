const express = require("express");
const app = express();
const router = express.Router();
const limiter = require("../middlewere/rateLimiter");
const studyYearController = require("../controllers/study_year_con");

router.get('/v1/studyYear', studyYearController.getAll);  
router.get('/v1/studyYear/:id', studyYearController.getById);  


module.exports = router;