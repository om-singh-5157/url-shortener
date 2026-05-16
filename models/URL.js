const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  browser:   { type: String, default: 'Unknown' },
  os:        { type: String, default: 'Unknown' },
  device:    { type: String, default: 'Desktop' },
  country:   { type: String, default: 'Unknown' },
  referrer:  { type: String, default: 'Direct' },
});

const URLSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode:   { type: String, required: true, unique: true },
  customAlias: { type: String, default: null },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clicks:      [ClickSchema],
  expiresAt:   { type: Date, default: null },
  isActive:    { type: Boolean, default: true },
  createdAt:   { type: Date, default: Date.now },
});

// Virtual: total click count
URLSchema.virtual('clickCount').get(function() {
  return this.clicks.length;
});

// Index for fast lookup
URLSchema.index({ shortCode: 1 });
URLSchema.index({ user: 1 });

module.exports = mongoose.model('URL', URLSchema);
