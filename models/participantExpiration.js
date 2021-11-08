const mongoose = require("mongoose");
const internal = require("stream");

// this allow for faster and more efficient remove participant
const participantExpiration = new mongoose.Schema({
    // participant expiration is a circular array consist of 5 day
    index: {type: Number, require: true},
    participator: {type: String,     require: true},
    user: {type: String, require:true},
    invitation: String
    
    
    

})

/**
 * Add 5 document to store participant's invitation that
 */
for(var i=0; i < 5; i++){
    participantExpiration.create(
        {
            index: i,
            participantList: []
        }
    );
}
const ParticipantExpiration = mongoose.model("ParticipantExpiration", participantExpiration);
module.exports = ParticipantExpiration;