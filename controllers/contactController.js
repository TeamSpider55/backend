const mongoose = require('mongoose');
const Contact = require('../models/contacts');
const User = require('../models/users');
const tagController = require('./tagController');

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
      data: tag,
      statusCode: 200,
    });
  }
  return res.json({
    data: null,
    statusCode: 500,
  });
};

// create a tag to a contact
const addTagToContact = async (req, res) => {
  // find the contact
  const { contactId, userId } = req.body;
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
      data: contact.tags,
      statusCode: 200,
    });
  }
  return res.json({
    data: null,
    statusCode: 500,
  });
};

// get tags for a contact
const getTagsFromContact = async (req, res) => {
  // find the contact
  const { contactId } = req.body;
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
  const { contactId, userId } = req.body;
  const contact = await Contact.findOne({
    _id: mongoose.Types.ObjectId(contactId),
  });
  let returnObj;

  if (contact) {
    // The id for the tag to delete
    const { tagId } = req.body;

    // filter out the tag to be deleted
    const tags = contact.tags.filter((id) => id !== tagId);

    // update tags of the contact
    contact.tags = tags;
    await contact.save();

    // delete the tag from the collection
    const deleteSuccess = await tagController.deleteTag(tagId, userId);

    // return message upon deletion
    if (deleteSuccess) {
      returnObj = {
        data: tags,
        statusCode: 200,
      };
    } else {
      returnObj = {
        data: null,
        statusCode: 500,
      };
    }
  }
  returnObj = {
    data: null,
    statusCode: 404,
  };
  res.json(returnObj);
};

// find one contact by their id
const getOneContact = async (req, res) => {
  const { userName } = req.params;
  const { contactId } = req.params;
  try {
    const user = await User.findOne({
      userName,
    });
    const oneContact = await Contact.findOne({
      _id: mongoose.Types.ObjectId(contactId),
    }).lean();
    if (oneContact === null) {
      // no contact found in database
      res.status(404);
      return res.json({
        statusCode: 404,
      });
    }
    if (user === null) {
      // no User found in database
      res.status(404);
      return res.json({
        statusCode: 404,
      });
    }
    // contact was found, return as response
    return res.json({
      statusCode: 200,
      data: oneContact,
    });
  } catch (err) {
    // error occurred
    res.status(400);
    return res.json({
      statusCode: 400,
      data: err,
    });
  }
};

// change a contact (POST)
const updateContact = async (req, res) => {
  const newContact = req.body; // this has all the attributes
  const { contactId } = req.body;
  try {
    const oneContact = await Contact.findOne({
      _id: mongoose.Types.ObjectId(contactId),
    });
    if (oneContact === null) {
      // no contact found in database
      res.status(404);
      return res.json({
        statusCode: 404,
      });
    }
    // update the contact's details
    oneContact.nickName = newContact.nickName;
    oneContact.familyName = newContact.familyName;
    oneContact.middleName = newContact.middleName;
    oneContact.givenName = newContact.givenName;
    oneContact.email = newContact.email;
    oneContact.phone = newContact.phone;
    oneContact.address = newContact.address;
    oneContact.description = newContact.description;
    oneContact.note = newContact.note;
    oneContact.tags = newContact.tags;
    // oneContact.tags = newContact.tags.map((tag) => ({
    //   //Do we map for tags array? how do we do it if they are changing the other stuff
    //   _id: mongoose.Types.ObjectId(),
    //   tagId: tag.tagId,
    //   description: tag.description,
    //   color: tag.color,
    //   priority: tag.priority,
    // })) let result =

    await oneContact.save();
    // contact was found, return as response
    return res.json({
      statusCode: 200,
      data: oneContact,
    });
  } catch (err) {
    // error occurred
    res.status(400);
    return res.json({
      statusCode: 400,
      data: err,
    });
  }
};

const deleteOneContact = async (req, res) => {
  const { userName } = req.body;
  const { contactId } = req.body;
  try {
    const user = await User.findOne({
      userName,
    });
    const oneContact = await Contact.findOne({
      _id: mongoose.Types.ObjectId(contactId),
    }).lean();
    if (oneContact === null) {
      // no contact found in database
      res.status(404);
      return res.json({
        statusCode: 404,
      });
    }
    if (user === null) {
      // no User found in database
      res.status(404);
      return res.json({
        statusCode: 404,
      });
    }
    await Contact.deleteOne({ _id: mongoose.Types.ObjectId(oneContact._id) });
    const result = user.contacts.filter((contact) => contact !== contactId);
    user.contacts = result;
    await user.save();
    // contact was deleted successfully
    return res.json({
      statusCode: 200,
      data: user,
    });
  } catch (err) {
    // error occurred
    res.status(400);
    return res.json({
      statusCode: 400,
      data: err,
    });
  }
};

// add a contact, given their email, family name, given name
const addContact = async (req, res) => {
  const { userName } = req.body;
  const { email } = req.body;
  const { familyName } = req.body;
  const { givenName } = req.body;
  try {
    const user = await User.findOne({
      userName,
    });
    if (user === null) {
      // no User found in database
      res.status(404);
      return res.json({
        statusCode: 404,
      });
    }
    const contact = await Contact.create({
      email,
      familyName,
      givenName,
      tags: [],
    });
    user.contacts.push(contact._id);
    await user.save();

    // contact added successfully
    return res.json({
      statusCode: 200,
      data: contact,
    });
  } catch (err) {
    // error occured with adding contact
    res.status(400);
    return res.json({
      statusCode: 400,
      data: err,
    });
  }
};

module.exports = {
  updateContactTag,
  addTagToContact,
  getTagsFromContact,
  deleteTagFromContact,
  getOneContact,
  updateContact,
  deleteOneContact,
  addContact,
};
