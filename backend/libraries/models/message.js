import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  files: {
    type: [String], // URLs (e.g., Firebase Storage links)
    default: []
  },
  status: {
    type: String,
    enum: ['complete', 'streaming', 'failed'],
    default: 'complete'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false }); // Optional: prevent subdocument _id bloat

export default MessageSchema;
