const Tag = require("../models/tags");
const User = require("../models/users");

let tagController = {
  // Get a single tag via object id
  getsingleTag: async (tagId) => {
    try {
      const tag = await Tag.findOne({ _id: tagId });
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
        let tag = await Tag.findOne({ _id: tagId });
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
      const tag = await Tag.create({ ...tagInfo });
      // update inventory of tags for the user
      const user = await User.findOne({ _id: userId });
      user.tags.push(tag._id);
      await User.save();
      return tag;
    } catch (err) {
      return null;
    }
  },

  // update a single tag
  updateTag: async (tagId, tagInfo) => {
    try {
      const tag = await Tag.updateOne({ _id: tagId }, { $set: { ...tagInfo } });
      return tag;
    } catch (err) {
      return null;
    }
  },
  // delete a tag
  deleteTag: async (tagId, userId) => {
    try {
      // update inventory of tags for the user
      const user = await User.findOne({ _id: userId });
      user.tags.filter((id) => id !== tagId);
      await User.save();
      // delete the tag collection
      await Tag.deleteOne({ _id: tagId });
      return true;
    } catch (err) {
      return false;
    }
  },
};

module.exports = tagController;
