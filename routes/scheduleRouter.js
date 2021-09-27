const express = require('express');

const router = express.Router();
const ScheduleController = require('../controllers/scheduleController');

/* Send the path with URL parameter to indicate that we want to retrieve
 * a single schedule with the date and belong to a user
 */
router.get('/retrieve/single/:date/:user', async (req, res) => {
  const unixTime = parseInt(req.params.date, 10);
  const { user } = req.params;
  res.json(await ScheduleController.retrieveSchedule(unixTime, user));
});

/*
 */
router.get('/retrieve/many/:user', async (req, res) => {
  const { user } = req.params;
  res.json(await ScheduleController.retrieveAllScheduleByUser(user));
});

router.get('/retrieve/many/:user/:start/:end', async (req, res) => {
  const concreteUser = req.params.user;
  const { start } = req.params;
  const { end } = req.params;

  res.json(await ScheduleController.retrieveAllScheduleBetween(concreteUser, start, end));
});

router.post('/add', async (req, res) => {
  const unixTime = parseInt(req.body.date, 10);
  const concreteUser = req.body.user;
  res.json(await ScheduleController.addSchedule(unixTime, concreteUser));
});

router.post('/remove/single', async (req, res) => {
  const unixTime = parseInt(req.body.date, 10);
  const concreteUser = req.body.user;

  res.json(await ScheduleController.removeSchedule(unixTime, concreteUser));
});

router.post('/remove/many/user', async (req, res) => {
  const concreteUser = req.body.user;

  res.json(await ScheduleController.removeAllSchedule(concreteUser));
});

router.post('/remove/many/user/between', async (req, res) => {
  const concreteUser = req.body.user;
  const start = parseInt(req.body.start, 10);
  const end = parseInt(req.body.end, 10);

  res.json(await ScheduleController.removeAllScheduleBetween(concreteUser, start, end));
});
module.exports = router;
