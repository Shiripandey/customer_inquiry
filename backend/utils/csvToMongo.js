// utils/csvToMongo.js
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Message = require('../models/messageModel'); // Import the model

// Define your MongoDB URI directly
const MONGO_URI = 'mongodb://localhost:27017/messagingApp';

// Log to verify that MONGO_URI is loaded correctly
console.log('MongoDB URI:', MONGO_URI);

const dbConnect = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to MongoDB
dbConnect();

const messages = [];

// Read CSV file and import data into MongoDB
fs.createReadStream('../data/GeneralistRails_Project_MessageData.csv')
  .pipe(csv())
  .on('data', (row) => {
    messages.push({
      id: row['User ID'],              // Corrected to match the CSV header
      timestamp: row['Timestamp (UTC)'], // Corrected to match the CSV header
      messageContent: row['Message Body'], // Corrected to match the CSV header
    });
  })
  .on('end', async () => {
    try {
      await Message.insertMany(messages);
      console.log('Messages successfully imported to MongoDB');
      process.exit();
    } catch (error) {
      console.error(`Error: ${error}`);
      process.exit(1);
    }
  });
