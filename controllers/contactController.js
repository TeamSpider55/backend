const mongoose = require('mongoose')
const Contact = require('../models/contacts')
const User = require('../models/users')

// find one contact by their id
const getOneContact = async (req, res) => {
  const userName = req.body.userName
  const id = req.body.id
  try {
    const user = await User.findOne({
      userName: userName,
    })
    // const contact = await Promise.all(
    //   user.contact.map(async (id) => {
    //     var contact = await Contact.findOne({ _id: id }).lean()
    //     return contact
    //   })
    // )
    const oneContact = await Contact.findOne({ _id: id }).lean()

    if (oneContact === null) {
      // no contact found in database
      res.status(404)
      return res.json({
        errorCode: 404,
        message: `Contact not found.`,
        backTo: '/user',
      })
    }
    if (user === null) {
      // no Contact found in database
      res.status(404)
      return res.json({
        errorCode: 404,
        message: `User not found.`,
        backTo: '/user',
      })
    }
    // contact was found, return as response
    return res.json({
      contact: oneContact,
    })
  } catch (err) {
    console.log(err)
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
  getOneContact,
}
