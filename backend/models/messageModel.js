// models/messageModel.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  messageContent: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'], // define priority levels
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['unread', 'inprogress', 'replied'], // define status levels
    default: 'unread'
  }
}, {
  timestamps: true // automatically manage createdAt and updatedAt
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
