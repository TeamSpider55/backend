const ScheduleController = require("./scheduleController");
const Util = require("../lib/util");

let eventController = {
  /* Check if the event overlapse with any event in the existEvents
   * @param: {Object} where we want to insert into the schedule document
   * @param: {Array} of the existed schedule
   * @return: {bool} true if the event does not overlapse with any existed event
   */
  ValidateEvent: (event, existEvents) => {
    if (event.end <= event.start) return false;
    if (existEvents.length > 0) {
      for (var exist of existEvents) {
        if (
          (event.end > exist.start && event.start <= exist.end) ||
          (event.start > exist.start && event.start <= exist.end)
        ) {
          return false;
        }
      }
    }
    return true;
  },

  /* use to sort the 2 event according to its scheduled time
   * @param: {Object} event
   * @pram: {Object} event
   * @return: {Int}
   */
  compare: (eventA, eventB) => {
    if (eventA.end < eventB.start) {
      return -1;
    }
    if (eventA.start > eventB.end) {
      return 1;
    }
    console.log("Found a invalid pair of event:" + eventA + ", " + eventB);
    return 0;
  },

  /* method to compare two event.
   * given that the event is belong to the same user
   * the start + end will be enough to identify the event, since there wont be any over lapsing event.
   * @param: {Object} the target event
   * @param: {Object} the event that is being compare to
   * @return: {bool} true if they have same start/end
   */
  isEqual: (event, existEvent) => {
    try {
      if (event.start != existEvent.start) {
        return false;
      }
      if (event.end != existEvent.end) {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  },

  /* Given a schedule is known, we add the event straight to it if there are no collision
   * @param: {Object} the propose event
   * @param: {Object} the reference object to a document in the collection
   * @return: {bool} true if adding is successfully
   */
  AddEventUseSchedule: async (event, schedule) => {
    let adjustEvent = event;
    var returnVal = {
      status: true,
      errorMessage: ""
    }
    adjustEvent.start = Util.extractUnixOfYYYY_MM_DD_HH_MM(adjustEvent.start);
    adjustEvent.end = Util.extractUnixOfYYYY_MM_DD_HH_MM(adjustEvent.end);
    if (eventController.ValidateEvent(event, schedule.events)) {
      await schedule.events.push(adjustEvent);
      await schedule.save();
      return returnVal;
    }
    returnVal.errorMessage = "Propose Event is overlapse with an existed event!!!";
    returnVal.status = false;
    return returnVal;
  },

  /* Given a new event is create, find the collection where it potential be added to
   * -> event will only be added if there are no clash with the existed events
   * @param: {Object} the propose event
   * @param: {String} the user where this event belong to
   */
  AddEvent: async (event, user) => {
    let date = Util.extractUnixOfYYYY_MM_DD(event.start);

    // retrieve the schedule where the event belong to
    let schedule = (await ScheduleController.retrieveSchedule(date, user)).schedule;
    if (schedule == null) {
      schedule = await ScheduleController.addSchedule(date, user);
    }
  
    return await eventController.AddEventUseSchedule(event, schedule);
  },

  /* Remove the event from the schedule.
   * -> if there are no event left post removal, remove the schedule.
   * @param: {Object} that is queue to be remove
   * @param: {Object} reference to a document in the collection.
   * @return: {bool} return true if we able to remove the event
   */
  removeEventUseSchedule: async (event, schedule) => {
    // check if schedule contain any event
    if (schedule.events.length == 0) {
      return await ScheduleController.removeSchedule(schedule.date, schedule.user);
    }
    var returnVal = {
      status: true,
      errorMessage: ""
    };

    for (var i = 0; i < schedule.events.length; i++) {
      // if the event match, remove it
      if (eventController.isEqual(event, schedule.events[i])) {

        if (schedule.events.length == 0)
          await ScheduleController.removeSchedule(schedule.date, schedule.user);
        else await schedule.save();
        return returnVal;
      }
    }
    returnVal.status = false;
    returnVal.errorMessage = "The targetted event does not exist!!!";
    return returnVal;
  },

  /* Remove an event belong to a user
   * @param: {Object} event that is in the collection
   * @param: {String} id of the user
   */
  removeEvent: async (event, user) => {
    let standardisedEvent = event;
    standardisedEvent.start = Util.extractUnixOfYYYY_MM_DD_HH_MM(event.start);
    standardisedEvent.end = Util.extractUnixOfYYYY_MM_DD_HH_MM(event.end);
    // find the schedule
    let date = Util.extractUnixOfYYYY_MM_DD(standardisedEvent.start);
    let schedule = (await ScheduleController.retrieveSchedule(date, user)).schedule;
    if (schedule == null) {
      return {
        status: false,
        errorMessage: "The event does not existed!!!"
      };
    }
    return await eventController.removeEventUseSchedule(
      standardisedEvent,
      schedule
    );
  },

  /* Retrieve the even of a user with the match start and end
   * @param: {Int} Unix time of the starting
   * @param: {Int} Unix time of the ending
   * @param: {String} the id of the user
   */
  retrieveEvent: async (start, end, user) => {
    // retrieve the schedule
    var returnVal = {
      event: null,
      errorMessage:"Event does not exist!!!"
    }
    let date = Util.extractUnixOfYYYY_MM_DD(start);
    let schedule = (await ScheduleController.retrieveSchedule(date, user)).schedule;
    if (schedule == null) {
      return returnVal;
    }

    for (var event of schedule.events) {
      if (
        event.start == Util.extractUnixOfYYYY_MM_DD_HH_MM(start) &&
        event.end == Util.extractUnixOfYYYY_MM_DD_HH_MM(end)
      ) {
        returnVal.event = event;
        returnVal.errorMessage = "";
        return returnVal;
      }
    }
    return returnVal;
  },

  /* given that we have the reference to the schedule, find all event store in it and sortit
   * @param: {Object} reference to the document in collection
   * @param: {bool} indicate if we want to sort the return list of event
   * @return {Array} of the event
   */
  retrieveSortedEventsInSchedule: async (schedule, isSort) => {
    let list = schedule.events;

    list = !isSort ? list : list.sort(eventController.compare);
    return {
      events: list,
      errorMessage: (list.length == 0) ? "There are no scheduled event in that day!!!": ""
    };
  },

  /* retrieve all the event of a day
   * @param: {Int} unix time of any hour in the day of which we want to retrieve
   * @param: {String} id of the user
   * @param: {bool} indicate if we want to sort the return list of event
   */
  retrieveSortedEventsInDay: async (unixTime, user, isSort) => {
    let date = Util.extractUnixOfYYYY_MM_DD(unixTime);
    let schedule =( await ScheduleController.retrieveSchedule(date, user)).schedule;

    if (schedule != null)
      return await eventController.retrieveSortedEventsInSchedule(
        schedule,
        isSort
      );
    else return {
      events: [],
      errorMessage: "There are no scheduled event in that day!!!"
    };
  },

  /* Move a event to another time slot -> this will need to be optimise
   * Assume that event will only span one day
   * @param: {Int} unix time of the initial starting
   * @param: {Int} unix time of the initial ending
   * @param: {Int} unix time of the new starting
   * @param: {Int} unix time of the new ending
   * @param: {String} id of the user
   * @return {bool} true if the re-schedulling is successful
   */
  modifedEventTime: async (
    unixStart,
    unixEnd,
    unixNewStart,
    unixNewEnd,
    user
  ) => {
    let start = Util.extractUnixOfYYYY_MM_DD_HH_MM(unixStart);
    let end = Util.extractUnixOfYYYY_MM_DD_HH_MM(unixEnd);
    let newStart = Util.extractUnixOfYYYY_MM_DD_HH_MM(unixNewStart);
    let newEnd = Util.extractUnixOfYYYY_MM_DD_HH_MM(unixNewEnd);

    // retrieve the event
    let event = (await eventController.retrieveEvent(unixStart, unixEnd, user)).event;
    // if event == null, then we should expect that the event is not in the database
    if (event == null) {
      return {
        
      };
    }
    console.log(event);

    if (
      Util.extractUnixOfYYYY_MM_DD(start) ==
        Util.extractUnixOfYYYY_MM_DD(newStart) &&
      Util.extractUnixOfYYYY_MM_DD(end) == Util.extractUnixOfYYYY_MM_DD(newEnd)
    ) {
      if (await eventController.removeEvent(event, user)) {
        event.start = newStart;
        event.end = newEnd;
        if (await eventController.AddEvent(event, user)) {
          console.log("add");
          return true;
        } else {
          console.log("add");
          event.start = start;
          event.end = start;
          await eventController.AddEvent(event, user);
        }
      }
      return false;
    }

    // attempt to add the re-schedule event to the new scheduled date
    event.start = newStart;
    event.end = newEnd;
    if (await eventController.AddEvent(event, user)) {
      // remove the event from the old place
      event.start = start;
      event.end = end;
      if (await eventController.removeEvent(event, user)) {
        return true;
      }
    }
    return false;
  },

  /* Same as modify time of the event. But the newStart and newEnd must be in the future
   */
  rescheduleEvent: async  (
    unixStart,
    unixEnd,
    unixNewStart,
    unixNewEnd,
    user
  ) => {
    if(unixNewStart < Date.now() || unixNewEnd < Date.now()){
      console.log("Invalid Rescheduling time, Must be in the future!!!");
      return await this.modifedEventTime(unixStart, unixEnd, unixNewStart, unixNewEnd, user);
    }
    return false;
  },
  
  /* [not tested] content is {tittle, note, type, category}
   * tag will have the whole set of method dealing with it. So does contacts
   * @param: {Object} consist of field indicate above. for which one of them is not needed to modied, set to null
   * @param: {Object} old event that exist in collection
   * @param: {String} id of the user
   * @return: {bool} true if we able to modify the document
   */
  modifyEventContent: async (newEvent, user) => {
    // retrieve the schedule
    let date = Util.extractUnixOfYYYY_MM_DD(newEvent.start);
    let schedule = await ScheduleController.retrieveSchedule(date, user);
    newEvent.start = Util.extractUnixOfYYYY_MM_DD_HH_MM(newEvent.start);
    newEvent.end = Util.extractUnixOfYYYY_MM_DD_HH_MM(newEvent.end);
    if (schedule == null) {
      return false;
    }

    // find the event
    for (var i = 0; i < schedule.events.length; i++) {
      if (
        schedule.events[i].start == newEvent.start &&
        schedule.events[i].end == newEvent.end
      ) {
        schedule.events[i].title =
          newEvent.title != null ? newEvent.title : schedule.events[i].title;
        schedule.events[i].note =
          newEvent.note != null ? newEvent.note : schedule.events[i].note;
        schedule.events[i].type =
          newEvent.type != null ? newEvent.type : schedule.events[i].type;
        schedule.events[i].category =
          newEvent.category != null
            ? newEvent.category
            : schedule.events[i].category;
        await schedule.save();
        return true;
      }
    }
    return false;
  },

  // Require: function to calculate free time.
};
module.exports = eventController;
