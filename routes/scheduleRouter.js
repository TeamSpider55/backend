const express = require("express");
const router = express.Router();
const ScheduleController = require("../controllers/scheduleController");


router.get("/retrieve/single/:date/:user", ScheduleController.retrieveSchedule);
router.get("/retrieve/many/:user", ScheduleController.retrieveAllSchedulesOfUser);
router.get("/retrieve/many/:user/:start/:end", ScheduleController.retrieveAllSchedulesOfUserBetween);
module.exports = router;