const express = require('express')
const contactRouter = express.Router()
const contactController = require('../controllers/contactController')
const userController = require('../controllers/userController')

contactRouter.get('/getContact/:userName/:contactId', contactController.getOneContact);
contactRouter.get('/getAllContacts/:userName', userController.getContactsForUser);
contactRouter.post('/updateContact', contactController.updateContact);
contactRouter.post('/addContact', contactController.addContact);
contactRouter.delete('/deleteContact', contactController.deleteOneContact);

module.exports = contactRouter




