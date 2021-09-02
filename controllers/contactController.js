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
    const oneContact = await Contact.findOne({ _id: id }).lean()
    if (oneContact === null) {
      // no contact found in database
      res.status(404)
      return res.json({
        statusCode: 404,
      })
    }
    if (user === null) {
      // no User found in database
      res.status(404)
      return res.json({
        statusCode: 404,
      })
    }
    // contact was found, return as response
    return res.json({
      statusCode: 200,
      data: oneContact,
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
module.exports = {
  getOneContact,
}
