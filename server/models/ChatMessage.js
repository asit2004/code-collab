const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  roomId:   { type: String, required: true, index: true },
  username: { type: String, required: true },
  message:  { type: String, required: true },
  type:     { type: String, enum: ['message', 'system'], default: 'message' },
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
