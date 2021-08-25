const mongoose = require('mongoose')
const Contact = require('../models/contact')
const User = require('../models/user')

// find all contacts for specific user
const getContactsForUser = async (req, res) => {
  try {
    const user = await User.findOne({
      userId: req.session.userId,
    })

    const contact = await Promise.all(
      user.contact.map(async (id) => {
        var contact = await Order.findOne({ contactId: id }).lean()
        return contact
      })
    )
    contact.reverse()

    if (user === null) {
      // no user found in database: 404
      res.status(404)
      return res.render('error', {
        errorCode: 404,
        message: 'Database query failed',
        backTo: '/user',
      })
    }
    // user was found, return as response
    return res.render('contact', {
      contact: contact,
    })
  } catch (err) {
    // error occurred
    res.status(400)
    return res.render('error', {
      errorCode: 400,
      message: 'Database query failed',
      backTo: '/user',
    })
  }
}

module.exports = {
  getContactsForUser,
}
