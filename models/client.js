const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: true },
  nickName: { type: String },
  familyName: { type: String, required: true },
  middleName: { type: String },
  givenName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  description: { type: String, required: true },
  tags: [{ type: String }],
});

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;
