const express = require('express');
const mongoose = require('mongoose');
const Message = require('./models/messageModel'); // Import the message model
const path = require('path'); // Import the path module
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Define your MongoDB URI directly
const MONGO_URI = 'mongodb://localhost:27017/messagingApp';

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Connect to MongoDB once
const dbConnect = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
    
    // Start the server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Serve static files (like CSS) from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html on the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to handle message submissions
app.post('/api/messages', async (req, res) => {
  try {
      const { userId, messageContent, priority, status } = req.body;

      if (!userId || !messageContent) {
          return res.status(400).json({ error: 'User ID and message content are required' });
      }

      const newMessage = new Message({
          userId,
          messageContent,
          priority: priority || 'medium', // default to 'medium' if not provided
          status: status || 'unread' // default to 'unread' if not provided
      });

      await newMessage.save();
      res.status(201).json(newMessage);
  } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Your feedback is stored; we will connect you soon.' });
  }
});

// API endpoint to fetch all messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find(); // Retrieve all messages from the database
    res.json(messages);
  } catch (error) {
    console.error(`Error fetching messages: ${error}`);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Start the database connection
dbConnect();
