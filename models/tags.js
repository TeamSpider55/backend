const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  description: { type: String, required: true },
  color: { type: String, required: true },
  priority: {
    type: Number, require: true, min: 1, max: 5,
  },
});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
