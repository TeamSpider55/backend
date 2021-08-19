const mongoose = require("mongoose");

// may be we want to put more stuff into the calender
// this slot contain everything requ
const scheduleSchema = new mongoose.Schema({

    // date can be key since each user's account's day is unique
    date: { type: Date, unique: true, required: true},

    events: [
        { eventId: { type: String, unique: true, required: true},
        schedule: {
            start:  {type: Date, required: true},
            end: { type: Date, required: true }
        },
        title: { type: String, required: true},
        note: { type: String},
    
        // this can be use to tell short story about this meeting,
        // in search engine
        // -> i want to use enum but does not
        category: {
            tag: { type: String, required: true}
        },
        // potetntially member involve in this meeting 
        contacts: [
            { type: String, required: true}
        ]}
    ]
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
