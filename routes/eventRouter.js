const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const Util = require("../lib/util");

router.post("/add", async (req, res) => {
  let user = req.body.user;
  // create the template for that event
  let event = {
    title: req.body.title,
    note: req.body.note,
    start: parseInt(req.body.start),
    end: parseInt(req.body.end),
    type: req.body.type,
    tags: [],
    contacts: [],
  };
  res.json( await eventController.AddEvent(event, user));
  
});

router.post("/remove", async (req, res) => {
  let user = req.body.user;
  let event = {
    start: parseInt(req.body.start),
    end: parseInt(req.body.end),
  };
  res.json(await eventController.removeEvent(event, user));
});

router.get("/retrieve/single/:start/:end/:user", async (req, res) => {
  let start = parseInt(req.params.start);
  let end = parseInt(req.params.end);

  let user = req.params.user;
  res.json( await eventController.retrieveEvent(start, end, user));
});

router.get("/retrieve/many/:date/:user", async (req, res) => {
  let unixTime = parseInt(req.params.date);
  let user = req.params.user;
  res.json(await eventController.retrieveSortedEventsInDay(
    unixTime,
    user,
    true
  ));
});

router.post("/reschedule", async (req, res) => {
  let unixStart = parseInt(req.body.start);
  let unixEnd = parseInt(req.body.end);
  let unixNewStart = parseInt(req.body.newStart);
  let unixNewEnd = parseInt(req.body.newEnd);
  let user = req.body.user;
  res.json( await eventController.rescheduleEvent(
    unixStart,
    unixEnd,
    unixNewStart,
    unixNewEnd,
    user
  ));
});

router.post("/modify/content", async (req, res) => {
  console.log("here");
  let newEvent = {
    title: req.body.title,
    note: req.body.note,
    start: parseInt(req.body.start),
    end: parseInt(req.body.end),
    type: req.body.type,
    category: req.body.category,
    tags: [],
    contacts: [],
  };
  console.log(newEvent);
  let user = req.body.user;

  res.json( await eventController.modifyEventContent(newEvent, user));
});

module.exports = router;
