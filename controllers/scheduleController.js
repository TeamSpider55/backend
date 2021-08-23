const { model } = require("mongoose");
const Schedule = require("../models/schedules");
const Util = require("../util");

/* Controll I/O from schedule collection ****************************************************************************************************
 */

let scheduleController = {
    
    

    /* Add schedule of the user to the data base (schedule collection)
     * @param {Number} time in millis second that is between 0:0:0 -> 23:59:59.999 of the scheduled day
     * @param {String} the user id where this schedule belong to
     * @return {Schedule} the instance scheduleSchema that is stored in data base of null;
     */
    addSchedule : async (unixTime, concreteUser) => {
        try{
            return await Schedule.create({
                date: Util.extractUnixOfYYYY_MM_DD(unixTime),
                user: concreteUser,
                events: []
            });
        }catch (err){
            // notify that the new schedule is existed in the db. aka: error code E11000
            if(err.message.includes("E11000 ")){
                console.log("Duplicate document: Scheduled day {" + new Date(unixTime) + "}, for id: '"
                 + concreteUser + "' is existed in Collection{Schedules}~!!!");
            }else{
                console.log(err);
            }
        } return null;
    },


    /* [done]Retrieve the schedules document using date and user
     * @param {Number} time in millis second that is between 0:0:0 -> 23:59:59.999 of the scheduled day
     * @param {String} the user id where this schedule belong to
     * @return {Schedule} that exist in collection or null
     */
    retrieveSchedule: async (unixTime, concreteUser) => {
        try{
            let schedule =  await Schedule.findOne({
                date: Util.extractUnixOfYYYY_MM_DD(unixTime),
                user: concreteUser
            });

            // log case targetted date is not in database
            if(schedule == null)
                console.log("Missing document: scheduled day {" + new Date(unixTime) + "}, for id: '" 
                + concreteUser + "' is missing from Collection{Schedules}~!!!");
            return schedule;
            }catch (err){
            console.log(err);
        }return null;
    },

    /* Retrieve all the schedule belong to a user
     * @param {String} the id of the user
     * @return {Schedule[]} contain all the schedule day of the user
     */
    retrieveAllScheduleByUser: async (concreteUser) => {
        try{
            let schedule =  await Schedule.find({
                user: concreteUser
            });

            // log case targetted date is not in database
            if(schedule == null)
                console.log("Missing document: scheduled day {" + new Date(unixTime) + "}, for id: '" + concreteUser 
                + "' is missing from Collection{Schedules}~!!!");
            return schedule;
        }catch (err){
            console.log(err);
        }return null;
    },

    /* Retrieve all the schedules that is between a indicated period of a user
     * @param {String} the id of the user
     * @param {Int} the unix time of the starting period
     * @param {Int} the unix time of the ending period
     * @return {schedule[]} 
     */
    retrieveAllScheduleBetween: async(concreteUser, start, end) => {
        try{
            let schedules = await Schedule.find({
                $and: [
                    {"date": {$gte: Util.extractUnixOfYYYY_MM_DD(start)}},
                    {"date": {$lte: Util.extractUnixOfYYYY_MM_DD(end)}}
                ],
                "user": concreteUser
            });

            if(schedules == null || schedules.length == 0){
                console.log("No document: scheduled day that between:{" 
                + new Date(Util.extractUnixOfYYYY_MM_DD(start)) + "} -> {" + 
                new Date(Util.extractUnixOfYYYY_MM_DD(end)) + "}, for id: '" + concreteUser + "' contain no document~!!!");
            }
            return schedules;
        }catch (err){
            console.log(err);
        }
    },

    /* Remove a schedule from the collection using time+ user
     * @param {Int} the unix time of the schedule
     * @param {String} the id of the user 
     * @return {bool} true if the delete is successful
     */
    removeSchedule: async (unixTime, concreteUser) => {
        
        let report = await Schedule.deleteOne({
            date: Util.extractUnixOfYYYY_MM_DD(unixTime),
            user: concreteUser
        });

        if(report.n == 1)
            return true;

        if(report.ok != 1)
            console.log("Error: occur when delete schedule at {" + new Date(Util.extractUnixOfYYYY_MM_DD(unixTime))) + 
                    ", of id:" + concreteUser + "!!!!";

        return false;
    },

    /* Remove all the schedule that belong to a user
     * useful when we want to remove a user.
     * @param {String} id of the user
     * @return {Int} number of deleted document -> incase we want to do further loging
     */
    removeAllSchedule: async (concreteUser) => {
        let report = await Schedule.deleteMany({
            user: concreteUser
        });

        if(report.ok != 1){
            console.log("Error: occur when delete schedule, of id:" + concreteUser + "!!!!");
        
        }return report.deletedCount;
    },

    /* Remove all the schedule that belong to a user between the start and end period
     * useful when we want to clear schedule day
     * @param {String} id of the user
     * @param {Int} the unix time indicate the starting of the period
     * @param {Int} the unix time indicate the ending of the period
     * @return {Int} number of deleted document -> incase we want to do further loging
     */
    removeAllScheduleBetween: async (concreteUser, start, end) => {
        let report = await Schedule.deleteMany({
            $and: [
                {"date": {$gte: Util.extractUnixOfYYYY_MM_DD(start)}},
                {"date": {$lte: Util.extractUnixOfYYYY_MM_DD(end)}}
            ],
            "user": concreteUser
        });
        if(report.ok != 1){
            console.log("Error: occur when delete schedule that is betwen {" + 
            new Date(Util.extractUnixOfYYYY_MM_DD(start))+"} to {" +
            + new Date(Util.extractUnixOfYYYY_MM_DD(end)) + "}, of id:" + concreteUser + "!!!!");
        
        }return report.deletedCount;
    }
};

module.exports = scheduleController;