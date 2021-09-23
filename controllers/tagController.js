const Tag = require("../models/tags");
const User = require("../models/users");
const mongoose = require("mongoose");

let tagController = {
  // Get a single tag via object id
  getsingleTag: async (tagId) => {
    try {
      const tag = await Tag.findOne({ _id: mongoose.Types.ObjectId(tagId) });
      return tag;
    } catch (err) {
      return null;
    }
  },

  // Get all tags from an array of tag ids
  getMultipleTags: async (tagIds) => {
    const tags = [];
    try {
      // find tag via objectId one by one
      for (tagId of tagIds) {
        let tag = await Tag.findOne({ _id: mongoose.Types.ObjectId(tagId) });
        tags.push(tag);
      }
      return tags;
    } catch (err) {
      return null;
    }
  },

  // create a single tag
  createTag: async (tagInfo, userId) => {
    // expect tagInfo inside the body
    try {
      // update inventory of tags for the user
      const user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
      if (user) {
        const tag = await Tag.create({ ...tagInfo });
        user.tags.push(tag._id);
        await user.save();
        return tag;
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  },

  // update a single tag
  updateTag: async (tagId, tagInfo) => {
    try {
      const tag = await Tag.updateOne(
        { _id: mongoose.Types.ObjectId(tagId) },
        { $set: { ...tagInfo } }
      );
      return tag;
    } catch (err) {
      return null;
    }
  },
  // delete a tag
  deleteTag: async (tagId, userId) => {
    try {
      // update inventory of tags for the user
      const user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
      if (user) {
        // filter out the tag to be deleted
        user.tags = user.tags.filter((id) => id !== tagId);
        await user.save();
        // delete the tag collection
        await Tag.deleteOne({ _id: mongoose.Types.ObjectId(tagId) });
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },
};

module.exports = tagController;
