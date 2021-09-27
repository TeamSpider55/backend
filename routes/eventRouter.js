const express = require('express');

const router = express.Router();
const eventController = require('../controllers/eventController');

const tagController = require('../controllers/tagController');

router.post('/add', async (req, res) => {
  const { user } = req.body;
  // create the template for that event
  const event = {
    title: req.body.title,
    note: req.body.note,
    start: parseInt(req.body.start, 10),
    end: parseInt(req.body.end, 10),
    type: req.body.type,
    tags: [],
    contacts: [],
  };
  const eventStatus = await eventController.AddEvent(event, user);
  res.json({
    date: eventStatus ? 'Add event successfully' : 'Fail to add Event',
    status: eventStatus,
  });
});

router.post('/remove', async (req, res) => {
  const { user } = req.body;
  const event = {
    start: parseInt(req.body.start, 10),
    end: parseInt(req.body.end, 10),
  };
  res.json(await eventController.removeEvent(event, user));
});

router.get('/retrieve/single/:start/:end/:user', async (req, res) => {
  const start = parseInt(req.params.start, 10);
  const end = parseInt(req.params.end, 10);

  const { user } = req.params;
  res.json(await eventController.retrieveEvent(start, end, user));
});

router.get('/retrieve/many/:date/:user', async (req, res) => {
  const unixTime = parseInt(req.params.date, 10);
  const { user } = req.params;
  const eventList = await eventController.retrieveSortedEventsInDay(
    unixTime,
    user,
    true,
  );
  res.json({
    data: eventList,
    status: eventList !== [],
  });
});

router.post('/reschedule', async (req, res) => {
  const unixStart = parseInt(req.body.start, 10);
  const unixEnd = parseInt(req.body.end, 10);
  const unixNewStart = parseInt(req.body.newStart, 10);
  const unixNewEnd = parseInt(req.body.newEnd, 10);
  const { user } = req.body;
  res.json(
    await eventController.rescheduleEvent(
      unixStart,
      unixEnd,
      unixNewStart,
      unixNewEnd,
      user,
    ),
  );
});

router.post('/modify/content', async (req, res) => {
  const newEvent = {
    title: req.body.title,
    note: req.body.note,
    start: parseInt(req.body.start, 10),
    end: parseInt(req.body.end, 10),
    type: req.body.type,
    category: req.body.category,
    tags: [],
    contacts: [],
  };
  const { user } = req.body;

  res.json(await eventController.modifyEventContent(newEvent, user));
});

// update a tag of a event
router.post('/tag/updateTag', async (req, res) => {
  const tagInfo = {
    description: req.body.tagDescription,
    color: req.body.tagColor,
    priority: req.tagPriority,
  };
  // change the tag
  const tag = await tagController.updateTag(req.body.tagId, tagInfo);
  if (tag) {
    return res.json({
      data: tag,
      statusCode: 200,
    });
  }
  return res.json({
    data: null,
    statusCode: 500,
  });
});

// create a tag to a event
router.post('/tag/addTag', async (req, res) => {
  // Unix time from req.body
  const { eventStart } = req.body;
  const { eventEnd } = req.body;
  const { userId } = req.body;

  // Find the event to update tag
  const event = await eventController.retrieveEvent(
    eventStart,
    eventEnd,
    userId,
  );
  // Create a tag
  const tagInfo = {
    description: req.body.tagDescription,
    color: req.body.tagColor,
    priority: req.tagPriority,
  };
  const tag = await tagController.createTag(tagInfo, userId);
  // Put the new tag to the exisitng array of tags of the event
  const newTagsArr = event.tags ? event.tags : [];
  newTagsArr.push(tag._id);
  const newEvent = { start: event.start, end: event.end, tags: newTagsArr };
  // Modify the event
  const modifySuccess = await eventController.modifyEventContent(
    newEvent,
    userId,
  );
  if (modifySuccess && tag) {
    return res.json({
      data: tag,
      statusCode: 200,
    });
  }
  return res.json({
    data: null,
    statusCode: 500,
  });
});

// get tags for a event
router.post('/tag/getTags', async (req, res) => {
  // Unix time from req.body
  const { eventStart } = req.body;
  const { eventEnd } = req.body;
  const { userId } = req.body;

  // Find the event to retrieve the tag Id array
  const event = await eventController.retrieveEvent(
    eventStart,
    eventEnd,
    userId,
  );

  // Find all tags via an array of Ids
  const tags = await tagController.getMultipleTags(event.tags);
  if (tags) {
    return res.json({ statusCode: 200, data: tags });
  }
  return res.json({ statusCode: 500, data: null });
});

// delete a tag
router.delete('/tag/deleteTag', async (req, res) => {
  // Unix time from req.body
  const { eventStart } = req.body;
  const { eventEnd } = req.body;
  const { userId } = req.body;

  // The id for the tag to delete
  const { tagId } = req.body;

  // Find the event to update tag
  const event = await eventController.retrieveEvent(
    eventStart,
    eventEnd,
    userId,
  );

  // filter out the tag to be deleted
  const tags = event.tags.filter((id) => id !== tagId);

  // Put the updated array of tags
  const newEvent = { start: event.start, end: event.end, tags };

  // Modify the event
  const modifySuccess = await eventController.modifyEventContent(
    newEvent,
    userId,
  );

  // delete the tag from the collection
  const deleteSuccess = await tagController.deleteTag(tagId, userId);

  if (modifySuccess && deleteSuccess) {
    return res.json({
      data: tags,
      statusCode: 200,
    });
  }
  return res.json({
    data: null,
    statusCode: 500,
  });
});

module.exports = router;
