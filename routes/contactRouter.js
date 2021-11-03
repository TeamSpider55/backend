const contactController = require("../controllers/contactController");
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const passport = require("passport");
router.use(passport.authenticate("jwt", { session: false }));

router.get("/getContact/:contactId", contactController.getOneContact);
router.get("/getAllContacts", userController.getContactsForUser);
router.post("/updateContact", contactController.updateContact);
router.post("/addContact", contactController.addContact);
router.delete("/deleteContact", contactController.deleteOneContact);

// update a tag of a event
router.post("/tag/updateTag", contactController.updateContactTag);

// create a tag to a contact
router.post("/tag/addTag", contactController.addTagToContact);

// get tags for a contact
router.post("/tag/getTags", contactController.getTagsFromContact);

// delete a tag
router.delete("/tag/deleteTag", contactController.deleteTagFromContact);

module.exports = router;
