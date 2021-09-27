const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  // blacklist expires at 1 hour (because jwt expires at 1h)
  createdAt: { type: Date, default: Date.now(), expires: '1h' },
  userId: { type: String, required: true },
  tokenId: { type: String, required: true },
});

const Blacklist = mongoose.model('Blacklist', blacklistSchema);
module.exports = Blacklist;
