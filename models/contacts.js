const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  nickName: { type: String },
  // since we argree that each user will have their own list of contact
  // and multiple user can reference the same contact and those contact store as different document
  familyName: { type: String, required: true },
  middleName: { type: String },
  givenName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  description: { type: String },
  note: { type: String },
  tags: [{ type: String }],

  participateEvent: [ String]
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
