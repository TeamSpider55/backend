// this is use for user and event participant to settle a date
const mongoose = require("mongoose");

const proposeEventSchema = new mongoose.Schema({

    proposeEventId = { type: String, require: true, unique: true},

    title: { type: String, required: true},
    note: String,
    duration: Number,
    link: { type: String, required: true},

    contacts: [
        {type: String, required: true}
    ],

    // each time a time is allocated, its vote number increase by 1
    // if after every one has vote: but there no propose Time that is have number of vote  == number of participant.
    // another round of email will be sending to all participant in order for them to adjust the vote time.
    
    // at round 4+, user will be the one to initiate the new round
    proposeTime: [
        {
            start: { type: date, required: true, unique: true},
            
            numVote: { type: Number, required: true, default: 1},
            by: [ {
                type: String, required: true
            }]
        }
    ]
});

const ProposeEvent = mongoose.model("ProposeEvent", proposeEventSchema);
module.exports = ProposeEvent;