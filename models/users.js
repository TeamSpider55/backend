const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  nickName: { type: String },
  familyName: { type: String, required: true },
  middleName: { type: String },
  givenName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }, //maybe we can pull weather information?
  status: {
    type: String,
    enum: ["PENDING", "ACTIVE"],
    required: true,
    default: "ACTIVE",
  },
  confirmationCode: { type: String, unique: true },

  contacts: [{ type: String }], //pull from clientSchema of client are we doing 1 guy login or?

  tags: [{ type: String }],
  salt: { type: String, required: true },
  hash: { type: String, required: true },
  blacklistTokens: [String],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
