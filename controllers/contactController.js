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
    const oneContact = await Contact.findOne({ _id: mongoose.Types.ObjectId(id) }).lean()
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
  const newContact = req.body //this has all the attributes
  const id = req.body.contactId
  try {
    
    const oneContact = await Contact.findOne({ _id: mongoose.Types.ObjectId(id) })
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
    // })) let result = 

    await oneContact.save()
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

const deleteOneContact = async (req, res) => {
  const userName = req.body.userName
  const id = req.body.contactId
  try {
    const user = await User.findOne({
      userName: userName,
    })
    const oneContact = await Contact.findOne({ _id: mongoose.Types.ObjectId(id) }).lean()
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
    await Contact.deleteOne({_id: mongoose.Types.ObjectId(oneContact._id)})
    const result = user.contacts.filter(contact => contact !== id)
    user.contacts = result
    await user.save()
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

// add a contact, given their email, family name, given name
const addContact = async (req, res) => {
  const userName = req.body.userName
  const email = req.body.email
  const familyName = req.body.familyName
  const givenName = req.body.givenName
  try {
    const user = await User.findOne({
      userName: userName,
    })
    if (user === null) {
      // no User found in database
      res.status(404)
      return res.json({
        statusCode: 404,
      })
    }
    const contact = await Contact.create({
      email: email,
      familyName: familyName,
      givenName: givenName,
      tags: [],
    })
    user.contacts.push(contact._id)
    await user.save()

    //contact added successfully
    return res.json({
      statusCode: 200,
      data: contact,
    })
  } catch (err) {
    console.log(err)
    //error occured with adding contact
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
  addContact,
}
