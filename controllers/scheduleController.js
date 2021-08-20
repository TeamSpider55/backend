const Schedule = require("../models/schedules");
require("../models/index");
// validate method
const setCategory = (cur, next) => {
    if((next == "free" || cur != "allocated"))
        throw new Error("Only able to request to free an allocated event!!!");
    return next;
}

// retrieve the scheduled date 
// null value indicate there are no event on that day
const retrieveSchedule = async (date) => {
    try{
        const schedule = await Schedule.findOne({date: date});
        return schedule;
    } catch(err){
        return null;
    }
};


// create the schedule
const createSchedule  = async (date) => {
    try{
        const schedule = await Schedule.create({date: date});
        return schedule;
    } catch (err){
        console.log("Error");
        return null;
    }
};

// for now put the auto mail here(just a shell)
// if user want to start a meeting, and wait for participator to vote for a time
const autoMailCallBack = (contacts, title) => {};

let sche = createSchedule(Date.now);
