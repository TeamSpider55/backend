const Schedule = require("../models/schedules");
const Util = require("../util");

/* Controll I/O from schedule collection ****************************************************************************************************
 */
/* Helper function. ******************************************************************************************************************
 */

/* Comparator of the schedule
 * -> this can be use to re organise the retrieve schedule to do calender
 * @param {Schedule} contain date
 * @para, {Schedule} contain date
 * @return {int} 1, if a > b ; -1, if a < b; 0 if a == b
 */
let compare = (scheduleA, scheduleB) => {
    if(scheduleA.date < scheduleB.date)
        return -1;
    if(scheduleA.date > scheduleB.date)
        return 1;
    return 0;
};

const scheduleController = {
   
    /* the URL that will retrieve is:
     * URL: "../schedule/retrieve/single/:date/:user"
     * req.param = {
     *   user: {type: int},
     *   date: {type: Int}
     * }
     * @param: {Object}
     * @param: {Object}
     * @return: {JsonObject} if cant retrieve, the object will be empty
     */
    retrieveSchedule: async (req, res) => {
        let schedule = null;
        try{
            schedule = await Schedule.findOne({
                // turn a string version of a unix time into the correctly formmated unix time
                date: Util.extractUnixOfYYYY_MM_DD(parseInt(req.params.date)),
                user: req.params.user
            });

            if(schedule == null) 
                console.log("Missing document: scheduled day {" + new Date(unixTime) + "}, for id: '" 
                    + concreteUser + "' is missing from Collection{Schedules}~!!!");

        } catch (err){
            console.log("Retrieve schedule: " + err);

        }return await res.json((schedule == null) ? {} : schedule);
    },

    /* The URL that will retrieve is
     * URL: "../schedule/retrieve/many/:user"
     * req.params = {
     *     user: {type: String}
     * }
     * @param: {Object}
     * @param: {Object}
     * @return: {JsonObject} 
     */
    retrieveAllSchedulesOfUser: async (req, res) => {
        let schedules = null;
        try{
            schedules = await Schedule.find({
                user: req.params.user
            });

            if(schedules == null || schedules.length == 0)
                console.log("Missing document: scheduled day for id: '" 
                     + req.params.user + "' is missing from Collection{Schedules}~!!!");

        } catch (err){
            console.log("Retrieve schedules: " + err);
        
        }return await res.json((schedules == null) ? [] : schedules);
    },

    /* The Url that will be retrieve is 
     * URL: "../schedule/retrieve/many/:user/:start/:end"
     * req.params = {
     *     user: {type: String},
     *     start: {type: String},
     *     end: {type:String}
     * }
     * @param: {Object}
     * @param: {Object}
     * @return: {JsonList}
     */
    retrieveAllSchedulesOfUserBetween: async (req, res) => {
        let schedules = null;
        try{
            let start = Util.extractUnixOfYYYY_MM_DD(parseInt(req.params.start));
            let end = Util.extractUnixOfYYYY_MM_DD(parseInt(req.params.end));

            schedules = await Schedule.find({
                $and: [
                    {"date": {$gte: start}},
                    {"date": {$lte: end}}
                ],
                "user": req.params.user
            });

            if(schedules == null || schedules.length == 0)
                console.log("Missing document: no scheduled day for id: '" 
                     + req.params.user + "' between" +  new Date(start) + "-" + new Date(end) +" in Collection{Schedules}~!!!");

        } catch (err){
            console.log("Retrieve schedules: " + err);
        
        } return await res.json((schedules == null) ? [] : schedules);
    }
};


module.exports = scheduleController;