const Contact = require("../models/contacts");
const router = require("express").Router();
const tagController = require("../controllers/tagController");
const mongoose = require("mongoose");

// update a tag of a event
const updateContactTag = async (req, res) => {
  const tagInfo = {
    description: req.body.tagDescription,
    color: req.body.tagColor,
    priority: req.tagPriority,
  };
  // change the tag
  const tag = await tagController.updateTag(req.body.tagId, tagInfo);
  if (tag) {
    return res.json({
      data: "succesfully updated tag!!!",
      statusCode: 200,
    });
  }
  res.json({
    data: "server failure!!!",
    statusCode: 500,
  });
};

// create a tag to a contact
const addTagToContact = async (req, res) => {
  // find the contact
  const contactId = req.body.contactId;
  const contact = await Contact.findOne({
    _id: mongoose.Types.ObjectId(contactId),
  });

  if (contact) {
    // Create a tag
    const tagInfo = {
      description: req.body.tagDescription,
      color: req.body.tagColor,
      priority: req.tagPriority,
    };
    const tag = await tagController.createTag(tagInfo, userId);

    // Put the new tag to the exisitng array of tags of the contact
    contact.tags.push(tag._id);

    // Modify the contact
    await contact.save();

    return res.json({
      data: "succesfully added tag!!!",
      statusCode: 200,
    });
  }
  return res.json({
    data: "failed to add tag!!!",
    statusCode: 500,
  });
};

// get tags for a contact
const getTagsFromContact = async (req, res) => {
  // find the contact
  const contactId = req.body.contactId;
  const contact = await Contact.findOne({
    _id: mongoose.Types.ObjectId(contactId),
  });

  if (contact) {
    // Find all tags via an array of Ids
    const tags = await tagController.getMultipleTags(contact.tags);
    if (tags) {
      return res.json({ statusCode: 200, data: tags });
    }
  }
  return res.json({ statusCode: 500, data: null });
};

// delete a tag
const deleteTagFromContact = async (req, res) => {
  // find the contact
  const contactId = req.body.contactId;
  const contact = await Contact.findOne({
    _id: mongoose.Types.ObjectId(contactId),
  });
  var returnObj;

  if (contact) {
    // The id for the tag to delete
    const tagId = req.body.tagId;

    // filter out the tag to be deleted
    let tags = contact.tags.filter((id) => id !== tagId);

    // update tags of the contact
    contact.tags = tags;
    await contact.save();

    // delete the tag from the collection
    const deleteSuccess = await tagController.deleteTag(tagId, userId);

    // return message upon deletion
    if (deleteSuccess) {
      returnObj = {
        data: "succesfully deleted tag!!!",
        statusCode: 200,
      };
    } else {
      returnObj = {
        data: "failed to delete tag!!!",
        statusCode: 500,
      };
    }
  }
  returnObj = {
    data: "contact not found!!!",
    statusCode: 404,
  };
  res.json(returnObj);
};

module.exports = {
  updateContactTag,
  addTagToContact,
  getTagsFromContact,
  deleteTagFromContact,
};
