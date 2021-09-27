const express = require('express');
const contactController = require('../controllers/contactController');

const router = express.Router();
const userController = require('../controllers/userController');

router.get('/getContact/:userName/:contactId', contactController.getOneContact);
router.get('/getAllContacts/:userName', userController.getContactsForUser);
router.post('/updateContact', contactController.updateContact);
router.post('/addContact', contactController.addContact);
router.delete('/deleteContact', contactController.deleteOneContact);

// update a tag of a event
router.post('/tag/updateTag', contactController.updateContactTag);

// create a tag to a contact
router.post('/tag/addTag', contactController.addTagToContact);

// get tags for a contact
router.post('/tag/getTags', contactController.getTagsFromContact);

// delete a tag
router.delete('/tag/deleteTag', contactController.deleteTagFromContact);

module.exports = router;
