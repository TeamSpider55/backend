const mongoose = require('mongoose')
const Contact = require('../models/contact')
const User = require('../models/user')
const { v4: uuidv4 } = require('uuid')

// add a contact, given their email, family name, given name
const addContact = async (req, res) => {
  const contact = req.body
  Contact.create(
    {
      contactId: uuidv4(),
      email: contact.email,
      familyName: contact.familyName,
      givenName: contact.givenName,
      //contactId: { type: String, unique: true }, //Foreign key only unique within the user(?)
      // nickName: { type: String },
      // middleName: { type: String }, //where do thse go?
      // phone: { type: String },
      // address: {},
      // description: { },
      note: [],
      tags: [],
    },
    (err, contact) => {
      if (err) {
        res.status(400)
        return res.send('Database query failed')
      } else {
        return res.send(contact)
      }
    }
  )
}

module.exports = {
  addContact,
}
