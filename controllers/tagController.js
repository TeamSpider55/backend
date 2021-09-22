const Tag = require("../models/tags");

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
    const tagIds = req.body.tagIds;
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
  createTag: async (tagInfo) => {
    // expect tagInfo inside the body
    try {
      const tag = await Tag.create({ ...tagInfo });
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
  deleteTag: async (tagId) => {
    try {
      const tag = await Tag.deleteOne({ _id: tagId });
      return tag;
    } catch (err) {
      return null;
    }
  },
};

module.exports = tagController;
