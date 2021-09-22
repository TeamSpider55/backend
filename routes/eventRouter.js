const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const scheduleController = require("../controllers/scheduleController");
const tagController = require("../controllers/tagController");
const Util = require("../lib/timeUtil");

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
  let eventStatus = await eventController.AddEvent(event, user);
  console.log(eventStatus);
  res.json({
    date: eventStatus ? "Add event successfully" : "Fail to add Event",
    status: eventStatus,
  });
});

router.post("/remove", async (req, res) => {
  let user = req.body.user;
  let event = {
    start: parseInt(req.body.start),
    end: parseInt(req.body.end),
  };
  let removeStatus = await eventController.removeEvent(event, user);
  res.json({
    data: removeStatus
      ? "Remove event successfully!!!"
      : "Fail to remove event!!!",
    status: removeStatus,
  });
});

router.get("/retrieve/single/:start/:end/:user", async (req, res) => {
  let start = parseInt(req.params.start);
  let end = parseInt(req.params.end);

  let user = req.params.user;
  let event = await eventController.retrieveEvent(start, end, user);
  res.json({
    date: event == null ? {} : event,
    status: event != null,
  });
});

router.get("/retrieve/many/:date/:user", async (req, res) => {
  let unixTime = parseInt(req.params.date);
  let user = req.params.user;
  let eventList = await eventController.retrieveSortedEventsInDay(
    unixTime,
    user,
    true
  );
  console.log(eventList);
  res.json({
    data: eventList,
    status: eventList != [],
  });
});

router.post("/reschedule", async (req, res) => {
  let unixStart = parseInt(req.body.start);
  let unixEnd = parseInt(req.body.end);
  let unixNewStart = parseInt(req.body.newStart);
  let unixNewEnd = parseInt(req.body.newEnd);
  let user = req.body.user;
  let reScheduleStatus = await eventController.rescheduleEvent(
    unixStart,
    unixEnd,
    unixNewStart,
    unixNewEnd,
    user
  );

  res.json({
    data: reScheduleStatus
      ? "Reschedule the event successfully!!!"
      : "Fail to reschedule the event!!!",
    status: reScheduleStatus,
  });
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

  let modifyStatus = await eventController.modifyEventContent(newEvent, user);

  res.json({
    data: modifyStatus ? "Modify Event successfully!!!" : "Fail to modify data",
    status: modifyStatus,
  });
});

// get all tags of a event
router.post("/tag/tags", async (req, res) => {
  const tags = await tagController.getMultipleTags(req.tagIds);
  if (tags) {
    return res.json({
      data: tags,
      status: 200,
    });
  }
  // Internal server error
  return res.json({
    data: null,
    status: 500,
  });
});

// update a tag of a event
router.post("/tag/updateTag", async (req, res) => {
  const tag = await tagController.updateTag(req.body.tagId, req.body.tagInfo);
  if (tag) {
    return res.json({
      data: "succesfully updated tag!!!",
      status: 200,
    });
  }
  res.json({
    data: "server failure!!!",
    status: 500,
  });
});

// create a tag to a event
// TODO: Complete this
router.post("/tag/addTag", async (req, res) => {
  // Unix time from req.body
  const eventStart = req.body.eventStart;
  const eventEnd = req.body.eventEnd;
  const userId = req.body.userId;

  // Find the event to update tag
  const event = await eventController.retrieveEvent(
    eventStart,
    eventEnd,
    userId
  );
  // Create a tag
  const tag = await tagController.createTag(req.body.tagInfo);
  // Put the new tag to the exisitng array of tags of the event
  const newTagsArr = event.tags.push(tag._id);
  const newEvent = { start: event.start, end: event.end, tags: newTagsArr };
  // Modify the event
  const modifySuccess = await eventController.modifyEventContent(
    newEvent,
    userId
  );
  if (modifySuccess) {
    return res.json({
      data: "succesfully added tag!!!",
      status: 200,
    });
  }
  return res.json({
    data: "failed to add tag!!!",
    status: 500,
  });
});

module.exports = router;
