const express = require('express')
const contactRouter = express.Router()
const contactController = require('../controllers/contactController')
const userController = require('../controllers/userController')
//const passport = require('passport')
//const authenticate = require('./authenticate')
//require("../config/contactPassport")(passport);

//Older version
// contactRouter.get('/oneContacts', contactController.getOneContact);
// contactRouter.get('/allContacts', userController.getContactsForUser);
// contactRouter.post('/updateContact', contactController.updateContact);
// contactRouter.post('/contacts', userController.addContact);

contactRouter.get('/getContact/:userId/:contactId', contactController.getOneContact);
contactRouter.get('/getAllContacts/:userId', userController.getContactsForUser);
contactRouter.post('/updateContact', contactController.updateContact);
contactRouter.post('/addContact', contactController.addContact);
contactRouter.delete('/deleteContact', contactController.deleteOneContact);


module.exports = contactRouter




