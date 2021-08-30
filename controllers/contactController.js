const mongoose = require('mongoose')
const Contact = require('../models/contacts')
const User = require('../models/users')

// find all contacts for specific user
const getContactsForUser = async (req, res) => {
  try {
    const user = await User.findOne({
      userName: req.session.userName,
    })
    //id is contactId in this context
    const contact = await Promise.all(
      user.contact.map(async (id) => {
        var contact = await Contact.findOne({ _id: id }).lean()
        return contact
      })
    )
    contact.reverse()

    if (contact === null) {
      // no user found in database: 404
      res.status(404)
      return res.json({
        errorCode: 404,
        message: 'Database query failed',
        backTo: '/user',
      })
    }
    // user was found, return as response
    return res.json({
      contact: contact,
    })
  } catch (err) {
    // error occurred
    res.status(400)
    return res.json({
      errorCode: 400,
      message: 'Database query failed',
      backTo: '/user',
    })
  }
}

module.exports = {
  getContactsForUser,
}
