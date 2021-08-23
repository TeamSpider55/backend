const express = require("express");
const router = express.Router();
const ScheduleController = require("../controllers/scheduleController");


router.get("/retrieve/single/:date/:user",(req, res) => {
    let unixTime = parseInt(req.params.date);
    let user = req.params.user;
    let schedule = ScheduleController.retrieveSchedule(unixTime, user);

    res.json((schedule == null) ?  {}: schedule);
});


router.get("/retrieve/many/:user", (req, res) => {
    let user = req.params.user;
    let schedules = ScheduleController.retrieveAllScheduleByUser(user);

    res.json((schedules == null) ? [] : schedules);
});



router.get("/retrieve/many/:user/:start/:end", (req, res) => {
    let concreteUser = req.params.user;
    let start = req.params.start;
    let end = req.params.end;

    let schedules = ScheduleController.retrieveAllScheduleBetween(concreteUser, start, end);

    res.json((schedules == null) ? [] : schedules);
});



router.post("/add", (req, res) => {
    let unixTime = parseInt(req.body.date);
    let concreteUser = req.body.user;

    if(ScheduleController.addSchedule(unixTime, concreteUser) != null){
        console.log("Add Schedule: successfully!!!");
    }
});



router.post("/remove/single", (req, res) => {
    let unixTime = parseInt(req.body.date);
    let concreteUser = req.body.user;

    if(ScheduleController.removeSchedule(unixTime, concreteUser)){
        console.log("Remove Schedule: successfull!!!");
    }
});



router.post("/remove/many/user", (req, res) => {
    let concreteUser = req.body.user;

    let deleteNum = ScheduleController.removeAllSchedule(concreteUser);

    if(deleteNum > 0)
        console.log("Remove Schedule: " + deleteNum + " is removed from the collection!!!");
});


router.post("/remove/many/user/between", (req, res) => {
    let concreteUser = req.body.user;
    let start = parseInt(req.body.start);
    let end = parseInt(req.body.end);

    
    let deleteNum = ScheduleController.removeAllScheduleBetween(concreteUser, start, end);

    if(deleteNum > 0)
        console.log("Remove Schedule: " + deleteNum + " is removed from the collection!!!");
});

module.exports = router;