import mongoose from 'mongoose';

const UserImageLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export const UserImageLog = mongoose.model('UserImageLog', UserImageLogSchema);
