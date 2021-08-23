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
     * URL: "../schedule/:date/retrieve"
     * req.param = {
     *   user: {type: String},
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
                date: Util.extractUnixOfYYYY_MM_DD(req.params.date),
                user: req.params.user
            });
            if(schedule == null) 

            console.log("Missing document: scheduled day {" + new Date(unixTime) + "}, for id: '" 
                + concreteUser + "' is missing from Collection{Schedules}~!!!");
        } catch (err){
            console.log("Retrieve schedule:" + err);

        }return await res.Json((schedule == null) ? {} : schedule.Json);
        
    },


};


module.exports = scheduleController;