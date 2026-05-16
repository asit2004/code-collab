const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  code:      { type: String, default: '' },
  language:  { type: String, default: 'javascript' },
  savedBy:   { type: String },
  savedAt:   { type: Date, default: Date.now },
  label:     { type: String, default: 'Snapshot' },
});

const roomSchema = new mongoose.Schema({
  roomId:    { type: String, required: true, unique: true },
  name:      { type: String, default: 'Untitled Room' },
  createdBy: { type: String },
  currentCode:    { type: String, default: '// Start coding here...\n' },
  currentLanguage:{ type: String, default: 'javascript' },
  versions:  [versionSchema],
  isPublic:  { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
