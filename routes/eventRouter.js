const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.post("/add", (req, res) => {
    let user = req.body.user;

    // create the template for that event
    let event = {
        title: req.body.title,
        note: req.body.note,
        start: parseInt(req.body.start),
        end: parseInt(req.body.end),
        type: req.body.type,
        category: req.body.category,
        tags: [],
        contacts: []
    };

    if(eventController.AddEvent(event, user))
        console.log("Add event to collection successfully");
});



router.post("/remove", (req, res) => {
    let user = req.body.user;
    let event = {
        start: parseInt(req.body.start),
        end: parseInt(req.body.end)
    };

    if(eventController.removeEvent(event, user))
        console.log("Remove event successfully!!!");
});



router.get("/retrieve/single/:start/:end/:user", (req, res) => {
    let start = parseInt(req.params.start);
    let end = parseInt(req.params.end);

    let user = req.params.user;
    let event = eventController.retrieveEvent(start, end, user);
    res.json((event == null) ? {} : event);
});



router.get("/retrieve/many/:date/:user", (req, res) => {
    let unixTime = parseInt(req.params.date);
    let user = req.params.user;

    res(eventController.retrieveSortedEventsInDay(unixTime, user, true));
});



router.post("/reschedule", (req, res) => {
    let unixStart = parseInt(req.body.start);
    let unixEnd = parseInt(req.body.end);
    let unixNewStart = parseInt(req.body.newStart);
    let unixNewEnd = parseInt(req.body.newEnd);
    let user = req.body.user;

    if(eventController.rescheduleEvent(unixStart, unixEnd, unixNewStart, unixNewEnd, user))
        console.log("Reschedule evnet successfully");
});

router.post("/modify/content", (req, res) => {
    let oldEvent = {
        title: req.body.title,
        note: req.body.note,
        start: parseInt(req.body.start),
        end: parseInt(req.body.end),
        type: req.body.type,
        category: req.body.category,
        tags: [],
        contacts: []
    };

    let newEvent = req.body.event;
    let user = req.body.user;

    if(eventController.modifyEventContent(newEvent, oldEvent, user))
        console.log("Modify Event successfully!!!");
});

module.exports = router;