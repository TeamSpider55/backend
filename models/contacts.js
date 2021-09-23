const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
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
})

const Contact = mongoose.model('Contact', contactSchema)
module.exports = Contact
