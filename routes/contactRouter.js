const contactController = require("../controllers/contactController");

// update a tag of a event
router.post("/tag/updateTag", contactController.updateContactTag);

// create a tag to a contact
router.post("/tag/addTag", contactController.addTagToContact);

// get tags for a contact
router.post("/tag/getTags", contactController.getTagsFromContact);

// delete a tag
router.delete("/tag/deleteTag", contactController.deleteTagFromContact);

module.exports = router;
