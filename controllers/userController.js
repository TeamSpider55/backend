const mongoose = require('mongoose')
const Contact = require('../models/contacts')
const User = require('../models/users')

// find all contacts for specific user
const getContactsForUser = async (req, res) => {
  const userName = req.params.userId
  try {
    const user = await User.findOne({
      userName: userName,
    })
    //id is contactId in this context
    const contacts = await Promise.all(
      user.contacts.map(async (id) => {
        var contact = await Contact.findOne({ _id: mongoose.Types.ObjectId(id) }).lean()
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
/*

Add a function that calls the contact controller create contact.
Inserts it into the user contact array
updates it via POST then returns status code for front end.
This version of the function is the one front-end will call

*/


module.exports = {
  getContactsForUser,
  
}
