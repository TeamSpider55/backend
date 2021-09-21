const mongoose = require('mongoose')
const Contact = require('../models/contacts')
const User = require('../models/users')

// find one contact by their id
const getOneContact = async (req, res) => {
  const userName = req.params.userId
  const id = req.params.contactId
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

// change a contact (POST)
const updateContact = async (req, res) => {
  try {
    const newContact = req.body //this has all the attributes
    const oneContact = await Contact.findOne({ _id: id }).lean()
    if (oneContact === null) {
      // no contact found in database
      res.status(404)
      return res.json({
        statusCode: 404,
      })
    }
    // update the contact's details
    oneContact.nickName = newContact.nickName
    oneContact.familyName = newContact.familyName
    oneContact.middleName = newContact.middleName
    oneContact.givenName = newContact.givenName
    oneContact.email = newContact.email
    oneContact.phone = newContact.phone
    oneContact.address = newContact.address
    oneContact.description = newContact.description
    oneContact.note = newContact.note
    oneContact.tags = newContact.tags
    // oneContact.tags = newContact.tags.map((tag) => ({
    //   //Do we map for tags array? how do we do it if they are changing the other stuff
    //   _id: mongoose.Types.ObjectId(),
    //   tagId: tag.tagId,
    //   description: tag.description,
    //   color: tag.color,
    //   priority: tag.priority,
    // }))
    let result = await oneContact.save()
    // contact was found, return as response
    return res.json({
      statusCode: 200,
      data: result,
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

const deleteOneContact = async (req, res) => {
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
    //use filter to delete it by setting the id as the filter then save it back to the user array. use await for the array
    Contact.deleteOne({ _id: id }).lean()
    //Does this delete? or only the linked in array

    // contact was deleted successfully
    return res.json({
      statusCode: 200,
      data: user,
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
  updateContact,
  deleteOneContact,
}
