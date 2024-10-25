// backend/controllers/messageController.js
const Message = require('../models/messageModel');

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({});
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

module.exports = { getMessages };
