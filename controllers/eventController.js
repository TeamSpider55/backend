const ScheduleController = require("./scheduleController");
const Util = require("../lib/timeUtil");
const Schedule = require("../models/schedules");
require("../config/db");

let eventController = {
  /* Check if the event overlaps with any event in the existEvents
   * @param: {Object} where we want to insert into the schedule document
   * @param: {Array} of the existed schedule
   * @return: {bool} true if the event does not overlaps with any existed event
   */
  ValidateEvent: (event, existEvents) => {
    if (event.end <= event.start) return false;
    if (existEvents != null && existEvents.length > 0) {
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
    let errMess = "Propose Event is overlaps with an existed event!!!";
    let adjEvent = event;
    adjEvent.start = Util.extractUnixOfYYYY_MM_DD_HH_MM(adjEvent.start);
    adjEvent.end = Util.extractUnixOfYYYY_MM_DD_HH_MM(adjEvent.end);

    let validation = eventController.ValidateEvent(event, schedule.events);
    if (validation) {
      if (schedule.events == null) schedule.events = [];
      schedule.events.push(adjEvent);
      await schedule.save();
    }
    return validation
      ? {
          data: "Successfully add the event to the schedule!!!",
          statusCode: 200,
        }
      : { data: errMess, statusCode: 400 };
  },

  /* Given a new event is create, find the collection where it potential be added to
   * -> event will only be added if there are no clash with the existed events
   * @param: {Object} the propose event
   * @param: {String} the user where this event belong to
   */
  AddEvent: async (event, user) => {
    let adjDate = Util.extractUnixOfYYYY_MM_DD(event.start);

    let response = await ScheduleController.retrieveSchedule(adjDate, user);
    if (response.statusCode == "400")
      response = await ScheduleController.addSchedule(adjDate, user);

    return response.statusCode == 400
      ? response
      : await eventController.AddEventUseSchedule(event, response.data);
  },

  /* Remove the event from the schedule.
   * -> if there are no event left post removal, remove the schedule.
   * @param: {Object} that is queue to be remove
   * @param: {Object} reference to a document in the collection.
   * @return: {bool} return true if we able to remove the event
   */
  removeEventUseSchedule: async (event, schedule) => {
    let deleted = false;
    for (var i = 0; i < schedule.events.length; i++) {
      if (eventController.isEqual(event, schedule.events[i])) {
        schedule.events.splice(i, 1);
        deleted = true;
      }
    }
    if (schedule.events.length == 0) {
      (await ScheduleController.removeSchedule(schedule.date, schedule.user));
    } else if (deleted) schedule.save();


    return deleted
      ? { data: "Successfully delete the event!!!", statusCode: 200 }
      : { data: "Fail to delete the event!!!", statusCode: 400 };
  },

  /* Remove an event belong to a user
   * @param: {Object} event that is in the collection
   * @param: {String} id of the user
   */
  removeEvent: async (event, user) => {
    let response = null;
    let adjDate = Util.extractUnixOfYYYY_MM_DD(event.start);
    let adjEvent = event;
    adjEvent.start = Util.extractUnixOfYYYY_MM_DD_HH_MM(event.start);
    adjEvent.end = Util.extractUnixOfYYYY_MM_DD_HH_MM(event.end);

    response = await ScheduleController.retrieveSchedule(adjDate, user);

    return response.statusCode == 400
      ? { data: "The event does not exist !!!", statusCode: 400 }
      : await eventController.removeEventUseSchedule(event, response.data);
  },
  
  updateEventParticipant: async (start, end, user, newP, type) => {
    let response = await ScheduleController.retrieveSchedule(Util.extractUnixOfYYYY_MM_DD(start), user);
    if(response.statusCode == 200){
      let schedule = response.data;

      for(var i=0; i < schedule.events.length; i++){
        
        if(schedule.events[i].start == start &&
            schedule.events[i].end == end){ 
              
              schedule.events[i].contacts[type] = newP;
          } 
        }  
      await schedule.save();
    }
  },
  /* Retrieve the even of a user with the match start and end
   * @param: {Int} Unix time of the starting
   * @param: {Int} Unix time of the ending
   * @param: {String} the id of the user
   */
  retrieveEvent: async (start, end, user) => {
    let isEq = (a, b) => a == Util.extractUnixOfYYYY_MM_DD_HH_MM(b);
    let adjDate = Util.extractUnixOfYYYY_MM_DD(start);
    let response = await ScheduleController.retrieveSchedule(adjDate, user);
    let val = null;

    if (response.statusCode == 200) {
      for (var event of response.data.events) {
        if (isEq(start, event.start) && isEq(end, event.end))
          val = { data: event, statusCode: 200 };
      }
    }
    return val == null
      ? {
          data: "No schedule found with the same date as event!!!",
          statusCode: 400,
        }
      : val;
  },

  /* given that we have the reference to the schedule, find all event store in it and sort it
   * @param: {Object} reference to the document in collection
   * @param: {bool} indicate if we want to sort the return list of event
   * @return {Array} of the event
   */
  retrieveSortedEventsInSchedule: async (schedule, isSort) => {
    let list = schedule.events;

    return schedule.events.lenth > 0
      ? { data: "Scheduled day with no event!!!", statusCode: 400 }
      : {
          data: isSort ? list.sort(eventController.compare) : list,
          statusCode: 200,
        };
  },

  /* retrieve all the event of a day
   * @param: {Int} unix time of any hour in the day of which we want to retrieve
   * @param: {String} id of the user
   * @param: {bool} indicate if we want to sort the return list of event
   */
  retrieveSortedEventsInDay: async (unixTime, user, isSort) => {
    let adjDate = Util.extractUnixOfYYYY_MM_DD(unixTime);
    let response = await ScheduleController.retrieveSchedule(adjDate, user);

    return response.statusCode == 400
      ? {
          data: "There are no scheduled event in that day!!!",
          statusCode: false,
        }
      : await eventController.retrieveSortedEventsInSchedule(
          response.data,
          isSort
        );
  },

  /* Move a event to another time slot -> this will need to be optimise
   * Assume that event will only span one day
   * @param: {Int} unix time of the initial starting
   * @param: {Int} unix time of the initial ending
   * @param: {Int} unix time of the new starting
   * @param: {Int} unix time of the new ending
   * @param: {String} id of the user
   * @return {bool} true if the re-scheduling is successful
   */
  modifiedEventTime: async (
    unixStart,
    unixEnd,
    unixNewStart,
    unixNewEnd,
    user
  ) => {
    let flag = 400;
    let checkDateVal = (a, b) =>
      Util.extractUnixOfYYYY_MM_DD(start) ==
      Util.extractUnixOfYYYY_MM_DD(newStart);

    let start = Util.extractUnixOfYYYY_MM_DD_HH_MM(unixStart);
    let end = Util.extractUnixOfYYYY_MM_DD_HH_MM(unixEnd);
    let newStart = Util.extractUnixOfYYYY_MM_DD_HH_MM(unixNewStart);
    let newEnd = Util.extractUnixOfYYYY_MM_DD_HH_MM(unixNewEnd);
    let eventRes = await eventController.retrieveEvent(
      unixStart,
      unixEnd,
      user
    );

    if (eventRes.statusCode == 200) {
      if (checkDateVal(start, newStart) && checkDateVal(end, newEnd)) {
        if ((await eventController.removeEvent(eventRes.data, user)).statusCode == 200) {
          console.log("remove successfully");
          eventRes.data.start = newStart;
          eventRes.data.end = newEnd;
          console.log(eventRes.data);
          if ((await eventController.AddEvent(eventRes.data, user)).statusCode == 200) {
            flag = 200;
          } else {
            console.log("cant add");
             eventRes.data.start = start;
             eventRes.data.end = end;
            //await eventController.AddEvent(eventRes.data, user);
          }
        }
      }
    }
    return flag == 200
      ? { data: "Successfully reschedule an event!!!", statusCode: 200 }
      : { data: "Fail to reschedule!!!", statusCode: 400 };
  },

  /* Same as modify time of the event. But the newStart and newEnd must be in the future
   */
  rescheduleEvent: async (
    unixStart,
    unixEnd,
    unixNewStart,
    unixNewEnd,
    user
  ) => {
    return unixNewStart < Date.now() || unixNewEnd < Date.now()
      ? await eventController.modifiedEventTime(
          unixStart,
          unixEnd,
          unixNewStart,
          unixNewEnd,
          user
        )
      : { data: "Rescheduled time must be in the future!!!", statusCode: 400 };
  },

  /* [not tested] content is {tittle, note, type, category}
   * tag will have the whole set of method dealing with it. So does contacts
   * @param: {Object} consist of field indicate above. for which one of them is not needed to modify, set to null
   * @param: {Object} old event that exist in collection
   * @param: {String} id of the user
   * @return: {bool} true if we able to modify the document
   */
  modifyEventContent: async (newEvent, user) => {
    // retrieve the schedule
    let cdate = Util.extractUnixOfYYYY_MM_DD(newEvent.start);
    let schedule = await Schedule.findOne({date: cdate,user: user});
    //await ScheduleController.retrieveSchedule(date, user);
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
        await schedule.save();
        return {data:"Successfully modify an event", statusCode: 200};
      }
    }
    return {data:"Unable to modify an event", statusCode: 400};
  },
  /**
   *  Retrieve all the event happen tomorrow
   */
  retrieveDueEvent: async () => {
    
  }

};

module.exports = eventController;
