/* This module is use between the user and all other participator
 * -> this is my own implementation of when2meet
 */

const mongoose = require('mongoose');
const Propose = require('../models/proposeEvent');
const EventController = require('./eventController');
const ScheduleController = require('./scheduleController');

const proposeEventController = {
  /* Add the version of the proposed event to data base
   * That event should not be deloy yet
   */
  init: async (eventDetail) => {
    try {
      return await Propose.create(eventDetail);
    } catch (err) {
      console.log(err);
    }
    return null;
  },
};
