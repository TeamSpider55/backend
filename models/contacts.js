const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
<<<<<<< HEAD:models/contact.js
  userId: { type: String, unique: true }, //Foreign key only unique within the user(?)
=======
  clientId: { type: String, required: true, unique: true },
>>>>>>> 98d562be30132f177da5d5353ec0c2ae333a0a31:models/contacts.js
  nickName: { type: String },
  familyName: { type: String, required: true },
  middleName: { type: String },
  givenName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  description: { type: String },
  note: { type: String },
  tags: [{ type: String }],
});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
