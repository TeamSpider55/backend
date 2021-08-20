const mongoose = require("mongoose");

// may be we want to put more stuff into the calender
// this slot contain everything requ
const scheduleSchema = new mongoose.Schema({

    // date can be key since each user's account's day is unique
    date: { type: Date, unique: true, required: true},

    events: [
        { 
            _eventId: { type: String, unique: true, required: true},
            
            title: { type: String, required: true},
            note: { type: String},
    
            // this can be use to tell short story about this meeting,
            // in search engine
            // -> i want to use enum but does not enforce ( from my research)
            type: {
                type: String,
                enum: ['personal', 'collaborate'],
                default: 'personal',
                required: true

            },
        
            // listed: is allocated by the user to be confirm by the contact
            // allocated: is the listed and got confirm by the contact person
            // free: is the request to be cancel and not yet be confirm by user
            category: {
                type: String,
                enum: ['listed', 'allocated', 'free' ,'available', 'pending'],
                default: 'listed',
                required: true
            },
            
            tags: [
                String
            ],
            // potetntially member involve in this meeting 
            // This is strictly
            contacts: [
                { type: String, required: true}
            ]
        }
    ]
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
