const Schedule = require("../models/schedules");
const Util = require("../lib/util");

/* Controll I/O from schedule collection ****************************************************************************************************
 */

let scheduleController = {

    /**Add schedule of the user to the data base (schedule collection)
    * @param {Number} time in millis second that is between 0:0:0 -> 23:59:59.999 of the scheduled day
    * @param {String} the user id where this schedule belong to
    * @return {Schedule} the instance scheduleSchema that is stored in data base of null;
    */
    addSchedule: async (unixTime, concreteUser) => {
        let errMess = "Fail to insert new schedule!!!";
        let schedule = null;
        try{
            schedule = await Schedule.create({
            date: Util.extractUnixOfYYYY_MM_DD(unixTime),
            user: concreteUser,
            events: [],
        });
        } catch (err) {
            errMess = err.message;
        }
        return (schedule == null) 
            ? { data:errMess , status: false}
            : { data:schedule, status: true};
    },

    /* [done]Retrieve the schedules document using date and user
    * @param {Number} time in millis second that is between 0:0:0 -> 23:59:59.999 of the scheduled day
    * @param {String} the user id where this schedule belong to
    * @return {Schedule} that exist in collection or null
    */
    retrieveSchedule: async (unixTime, concreteUser) => {
        let errMess = `No schedule ${new Date(Util.extractUnixOfYYYY_MM_DD(unixTIme)) }!!!`;
        let schedule = null;
        try{
            schedule = await Schedule.findOne({
                date: Util.extractUnixOfYYYY_MM_DD(unixTime),
                user: concreteUser
              });
        }catch (err){
            errMess = err.message;
        }
        return (schedule == null) 
            ? { data:errMess , status: false}
            : { data:schedule, status: true};
    },

    /* Retrieve all the schedule belong to a user
    * @param {String} the id of the user
    * @return {Schedule[]} contain all the schedule day of the user
    */
    retrieveAllScheduleByUser: async (concreteUser) => {
        let errMess = `No schedule for ${concreteUser}`;
        let schedules = null;
        try{
            schedules = await Schedule.find({
                user: concreteUser,
              });
        } catch (err){
            errMess = err.m;
        }return (schedules != null && schedules.length > 0) 
            ? { data:schedule, status: true}
            : { data:errMess , status: false};
    },

    /* Retrieve all the schedules that is between a indicated period of a user
    * @param {String} the id of the user
    * @param {Int} the unix time of the starting period
    * @param {Int} the unix time of the ending period
    * @return {schedule[]}
    */
    retrieveAllScheduleBetween: async (concreteUser, start, end) => {
        let errMess = `No schedule for ${concreteUser} between the indicate date`;
        let schedules = null;
        try{
            schedules = await Schedule.find({
                $and: [
                  { date: { $gte: Util.extractUnixOfYYYY_MM_DD(start) } },
                  { date: { $lte: Util.extractUnixOfYYYY_MM_DD(end) } },
                ],
                user: concreteUser,
              });
        } catch (err){
            errMess = err.m;
        }return (schedules != null && schedules.length > 0) 
            ? { data:schedule, status: true}
            : { data:errMess , status: false};
        
    },

    /* Remove all the schedule that belong to a user
    * useful when we want to remove a user.
    * @param {String} id of the user
    * @return {Int} number of deleted document -> incase we want to do further loging
    */
    removeAllSchedule: async (concreteUser) => {
        let errMess = "Error: occur when delete schedule, of id:" + concreteUser + "!!!!";
        let report = null;
        try{
            report = await Schedule.deleteMany({
                user: concreteUser,
            });
        } catch (err){
            errMess = err.message;
        }
        return (report == null || report.ok != 1)
            ? {data:errMess, status:false} 
            : {data:report.deletedCount, status: true};
    },

    /* Remove all the schedule that belong to a user between the start and end period
    * useful when we want to clear schedule day
    * @param {String} id of the user
    * @param {Int} the unix time indicate the starting of the period
    * @param {Int} the unix time indicate the ending of the period
    * @return {Int} number of deleted document -> incase we want to do further loging
    */
    removeAllScheduleBetween: async (concreteUser, start, end) => {
        let errMess = "Error: occur when delete schedule, of id:" + concreteUser + " between the indicate period!!!!";
        let report = null;
        try{
            report = await Schedule.deleteMany({
                $and: [
                  { date: { $gte: Util.extractUnixOfYYYY_MM_DD(start) } },
                  { date: { $lte: Util.extractUnixOfYYYY_MM_DD(end) } },
                ],
                user: concreteUser,
              });
        } catch (err){
            errMess = err.message;
        }
        return (report == null || report.ok != 1)
            ? {data:errMess, status:false} 
            : {data:report.deletedCount, status: true};
    },


    /* Remove a schedule from the collection using time+ user
    * @param {Int} the unix time of the schedule
    * @param {String} the id of the user
    * @return {bool} true if the delete is successful
    */
    removeSchedule: async (unixTime, concreteUser) => {
        let errMess = "Error: occur when delete schedule, of id:" + concreteUser + " at the indicate time!!!!";
        let report = null;
        try{
            report = await Schedule.deleteOne({
                date: Util.extractUnixOfYYYY_MM_DD(unixTime),
                user: concreteUser
              });
        } catch (err){
            errMess = err.message;
        }
        return (report == null || report.ok != 1)
            ? {data:errMess, status:false} 
            : {data:report.deletedCount, status: true};
    }
}

module.exports = scheduleController;