const express = require('express')
const userRouter = express.Router()
const contactController = require('../controllers/contactController')
const userController = require('../controllers/userController')
//const passport = require('passport')
//const authenticate = require('./authenticate')
//require("../config/contactPassport")(passport);

userRouter.get('/oneContacts', async (req, res) => {
  contactController.getOneContact(req, res)
})

// get the available users
userRouter.get('/allContacts', async (req, res) => {
  const contacts = await userController.getContactsForUser(req, res)
  if (contacts === null) {
    return res.json({
      errorCode: 404,
      message: 'Database query failed',
      backTo: '/user',
    })
  }
  res.send(contacts)
})
//authenticate.isUserLoggedIn
userRouter.post('/contacts', async (req, res) => {
  // add contact
  const contact = await userController.addContact(req, res)
  res.json({ success: true, msg: 'contact created' })
})

module.exports = userRouter
