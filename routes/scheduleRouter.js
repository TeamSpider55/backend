const express = require("express");
const router = express.Router();
const ScheduleController = require("../controllers/scheduleController");
const passport = require("passport");
router.use(passport.authenticate("jwt", { session: false }));

/* Send the path with URL parameter to indicate that we want to retrieve
 * a single schedule with the date and belong to a user
 */
router.get("/retrieve/single/:date/:user", async (req, res) => {
    let unixTime = parseInt(req.params.date);
    let user = req.body.user;
    res.json(await ScheduleController.retrieveSchedule(unixTime, user));
});


/*
 */
router.get("/retrieve/many/:user", async(req, res) => {
    let user = req.body.user;
    res.json( await ScheduleController.retrieveAllScheduleByUser(user));
});



router.get("/retrieve/many/:user/:start/:end", async(req, res) => {
    let concreteUser = req.params.user;
    let start = req.params.start;
    let end = req.params.end;

    res.json(await  ScheduleController.retrieveAllScheduleBetween(concreteUser, start, end));

});



router.post("/add", async(req, res) => {
    let unixTime = parseInt(req.body.date);
    let concreteUser = req.body.user;
    res.json( await ScheduleController.addSchedule(unixTime, concreteUser));
        
});



router.post("/remove/single", async(req, res) => {
    let unixTime = parseInt(req.body.date);
    let concreteUser = req.body.user;

    res.json( await ScheduleController.removeSchedule(unixTime, concreteUser));
});



router.post("/remove/many/user", async(req, res) => {
    let concreteUser = req.body.user;

    res.json(await ScheduleController.removeAllSchedule(concreteUser));
});


router.post("/remove/many/user/between", async (req, res) => {
    let concreteUser = req.body.user;
    let start = parseInt(req.body.start);
    let end = parseInt(req.body.end);

    
    res.json( await ScheduleController.removeAllScheduleBetween(concreteUser, start, end));
});
module.exports = router;