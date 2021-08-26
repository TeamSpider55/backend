const express = require("express");
const router = express.Router();
const ScheduleController = require("../controllers/scheduleController");

/* Send the path with URL parameter to indicate that we want to retrieve
 * a single schedule with the date and belong to a user
 */
router.get("/retrieve/single/:date/:user",(req, res) => {
    let unixTime = parseInt(req.params.date);
    let user = req.params.user;
    let schedule = ScheduleController.retrieveSchedule(unixTime, user);

    res.json({
        date:(schedule == null) ?  {}: schedule,
        status: (schedule != null)
    });
});


/*
 */
router.get("/retrieve/many/:user", (req, res) => {
    let user = req.params.user;
    let schedules = ScheduleController.retrieveAllScheduleByUser(user);

    res.json({
        data: (schedules == null) ? [] : schedules ,
        status: (schedules != null)
    });
});



router.get("/retrieve/many/:user/:start/:end", (req, res) => {
    let concreteUser = req.params.user;
    let start = req.params.start;
    let end = req.params.end;

    let schedules = ScheduleController.retrieveAllScheduleBetween(concreteUser, start, end);

    res.json({
        data: (schedules == null) ? [] : schedules,
        status: (schedules != null)
    });
});



router.post("/add", async (req, res) => {
    let unixTime = parseInt(req.body.date);
    let concreteUser = req.body.user;

    let schedule = await ScheduleController.addSchedule(unixTime, concreteUser);

    res.json({
        data: (schedule == null) ? "Add schedule fail!!!" : "Add schedule successfully!!!",
        status: (schedule != null)
    });
        
});



router.post("/remove/single", async (req, res) => {
    let unixTime = parseInt(req.body.date);
    let concreteUser = req.body.user;

    let statusVal = await ScheduleController.removeSchedule(unixTime, concreteUser);

    res.json({
        data: (statusVal) ? "Remove successfully!!!" : "Fail to remove!!!",
        status: statusVal
    });
});



router.post("/remove/many/user", async (req, res) => {
    let concreteUser = req.body.user;

    let deleteNum = await ScheduleController.removeAllSchedule(concreteUser);
    let successMess = "Remove Schedule: " + deleteNum + " is removed from the collection!!!";
    res.json({
        data: (deleteNum > 0) ? successMess : "Fail to delete the schedule!!!",
        status: (deleteNum > 0)
    });
});


router.post("/remove/many/user/between", async (req, res) => {
    let concreteUser = req.body.user;
    let start = parseInt(req.body.start);
    let end = parseInt(req.body.end);

    
    let deleteNum = await ScheduleController.removeAllScheduleBetween(concreteUser, start, end);
    let successMess = "Remove Schedule: " + deleteNum + " is removed from the collection!!!";
    res.json({
        data: (deleteNum > 0) ? successMess : "Fail to delete the schedule!!!",
        status: (deleteNum > 0)
    });
});

module.exports = router;