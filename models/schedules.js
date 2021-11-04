const mongoose = require("mongoose");

// may be we want to put more stuff into the calender
// this slot contain everything requ
const scheduleSchema = new mongoose.Schema({
  // date can be key since each user's account's day is unique
  // Date will only be "YYYY-MM_DD"

  // let the day be store as a Unix time
  // combination of date + user must be unique
  date: { type: Number, required: true },
  user: { type: String, required: true },

  events: [
    {
      title: { type: String, required: true },
      note: { type: String },
      start: { type: Number, required: true },
      end: { type: Number, required: true },
      // this can be use to tell short story about this meeting,
      // in search engine
      // -> i want to use enum but does not enforce ( from my research)
      type: {
        type: String,
        enum: ["personal", "collaborate"],
        default: "personal",
        required: true,
      },

      tags: [String],
      // potetntially member involve in this meeting
      // This is strictly
      contacts: [{ type: String, required: true }],
    },
  ],
});

// ensure the combination of date + user is unique
scheduleSchema.index({ date: 1, user: 1 }, { unique: true });
const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
