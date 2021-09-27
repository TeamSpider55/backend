const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  filename: { type: String, required: true, unique: true },
  fileId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
