const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const participantController = require("../controllers/participantController");
const Util = require("../lib/timeUtil");

router.post("/add/participant", async (req, res) => {
  let user = req.body.user;
  let start = req.body.start;
  let end = req.body.end;
  let email = req.body.email;
  let status = req.body.status;

  res.json(await participantController.pendingParticipant(start, end, user, email, status));
});

router.post("/remove/participant", async (req, res) => {
  let start = req.body.start;
  let end = req.body.end;
  let user = req.body.user;
  let email = req.body.email;
  let type = req.body.type;

  res.json(await participantController.removeParticipant(start, end, user, email, type));
});

router.post("/modify/participant", async (req, res) => {
  let start = req.body.start;
  let end = req.body.end;
  let user = req.body.user;
  let email = req.body.email;
  let type = req.body.type;
  let newE = req.boody.newEmail;

  res.json(await participantController.modifiedParticipant(start, end, user, email, newE, type));
})

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
    contacts: [
      pending = [],
      confirm = [],
    ],
  };
  res.json(await eventController.AddEvent(event, user));
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
  res.json(await eventController.retrieveEvent(start, end, user));
});

router.get("/retrieve/many/:date/:user", async (req, res) => {
  let unixTime = parseInt(req.params.date);
  let user = req.params.user;
  res.json(
    await eventController.retrieveSortedEventsInDay(unixTime, user, true)
  );
});

router.post("/reschedule", async (req, res) => {
  let unixStart = parseInt(req.body.start);
  let unixEnd = parseInt(req.body.end);
  let unixNewStart = parseInt(req.body.newStart);
  let unixNewEnd = parseInt(req.body.newEnd);
  let user = req.body.user;
  res.json(
    await eventController.rescheduleEvent(
      unixStart,
      unixEnd,
      unixNewStart,
      unixNewEnd,
      user
    )
  );
});

router.post("/modify/content", async (req, res) => {
  let newEvent = {
    title: req.body.title,
    note: req.body.note,
    start: parseInt(req.body.start),
    end: parseInt(req.body.end),
    type: req.body.type,
    category: req.body.category,
    tags: [],
    contacts: [
      pending = [],
      confirm = [],
    ],
  };
  let user = req.body.user;

  res.json(await eventController.modifyEventContent(newEvent, user));
});

module.exports = router;
