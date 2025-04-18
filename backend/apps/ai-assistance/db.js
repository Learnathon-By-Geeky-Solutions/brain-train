import { UserImageLog } from "../../libraries/models/userImageLog.js";
import { Chat } from '../../libraries/models/chat.js';

export const saveNewChat = (userId, name, userMessage, assistantMessage) => {
  const newChat = new Chat({
    userId,
    name,
    messages: [userMessage, assistantMessage],
  });
  return newChat.save();
};

export const appendMessagesToChat = (chatId, userMessage, assistantMessage) => {
  return Chat.findByIdAndUpdate(
    chatId,
    { $push: { messages: { $each: [userMessage, assistantMessage] } } },
    { new: true }
  );
};

export const getChatById = (chatId) => {
  return Chat.findById(chatId);
};



/**
 * Save image upload reference for a user
 * @param {string} userId
 * @param {string} imageUrl
 */
export const logUserImageUpload = async (userId, imageUrl) => {
    await UserImageLog.create({ userId, imageUrl });
  };



export const getUserImageUploads = async (userId) => {
    return await UserImageLog.find({ userId }).sort({ uploadedAt: -1 }).lean();
};
  