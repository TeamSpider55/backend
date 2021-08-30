const mongoose = require('mongoose')
const Contact = require('../models/contacts')
const User = require('../models/users')
// const { v4: uuidv4 } = require('uuid')

// add a contact, given their email, family name, given name
const addContact = async (req, res) => {
  const contact = req.body
  Contact.create(
    {
      //contactId: uuidv4(), //if we aren't using uuidv4 need somethign else
      email: contact.email,
      familyName: contact.familyName,
      givenName: contact.givenName,
      tags: [],
    },
    (err, contact) => {
      if (err) {
        res.status(400)
        return res.json('Database query failed')
      } else {
        return res.json(contact)
      }
    }
  )
}

module.exports = {
  addContact,
}
