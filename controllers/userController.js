const mongoose = require('mongoose')
const Contact = require('../models/contacts')
const User = require('../models/users')

// find all contacts for specific user
const getContactsForUser = async (req, res) => {
  const userName = req.body.userName
  try {
    const user = await User.findOne({
      userName: userName,
    })
    //id is contactId in this context
    const contacts = await Promise.all(
      user.contacts.map(async (id) => {
        var contact = await Contact.findOne({ _id: id }).lean()
        return contact
      })
    )

    if (contacts === null) {
      // no user found in database: 404
      res.status(404)
      return res.json({
        statusCode: 404,
      })
    }
    // user was found, return as response
    return res.json({
      statusCode: 200,
      data: contacts,
    })
  } catch (err) {
    console.log(err)
    // error occurred
    res.status(400)
    return res.json({
      statusCode: 400,
      data: err,
    })
  }
}

// add a contact, given their email, family name, given name
const addContact = async (req, res) => {
  const email = req.body.email
  const familyName = req.body.familyName
  const givenName = req.body.givenName
  try {
    const contact = await Contact.create({
      email: email,
      familyName: familyName,
      givenName: givenName,
      tags: [],
    })
    //contact added successfully
    return res.json({
      statusCode: 200,
      data: contact,
    })
  } catch (e) {
    console.log(e)
    //error occured with adding contact
    res.status(400)
    return res.json({
      statusCode: 400,
      data: err,
    })
  }
}

module.exports = {
  getContactsForUser,
  addContact,
}
