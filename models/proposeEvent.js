// this is use for user and event participant to settle a date
const mongoose = require("mongoose");

const proposeEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: { type: String, required: true },
  note: String,
  duration: Number,
  link: { type: String, required: true },

  contacts: [
    {
      email: { type: String, required: true },
      vote: { type: Boolean, required: true, default: false },
      idInGrp: { type: Integer, required: true },
    },
  ],

  // each time a time is allocated, its vote number increase by 1
  // if after every one has vote: but there no propose Time that is have number of vote  == number of participant.
  // another round of email will be sending to all participant in order for them to adjust the vote time.

  // at round 4+, user will be the one to initiate the new round
  proposeTime: [
    {
      start: { type: Number, required: true, unique: true },

      numVote: { type: Number, required: true, default: 1 },
      by: [
        {
          // use intege instead of email, to save time of string compare
          type: Integer,
          required: true,
        },
      ],
    },
  ],

  deloyState: { type: Boolean, required: true, default: false },

  round: { type: Number, required: true, default: 1 },
});
proposeEventSchema.index({ title: 1, user: 1 }, { unique: true });
const ProposeEvent = mongoose.model("ProposeEvent", proposeEventSchema);
module.exports = ProposeEvent;
