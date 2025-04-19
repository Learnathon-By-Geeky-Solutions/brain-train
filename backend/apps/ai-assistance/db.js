import { UserImageLog } from "../../libraries/models/userImageLog.js";
import { Chat } from "../../libraries/models/chat.js";
import mongoose from "mongoose";

export const saveNewChat = (userId, name, userMessage, assistantMessage) => {
  const newChat = new Chat({
    userId,
    name,
    messages: [userMessage, assistantMessage],
  });
  return newChat.save();
};

export const appendMessagesToChat = (chatId, userMessage, assistantMessage) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new Error("Invalid chatId");
  }

  return Chat.findByIdAndUpdate(
    chatId,
    { $push: { messages: { $each: [userMessage, assistantMessage] } } },
    { new: true },
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

/**
 * Returns all chats for a user (just _id and name).
 * @param {string} userId - Firebase UID of the user.
 * @returns {Promise<Array<{ _id: string, name: string }>>}
 */
export const getUserAllChatsSummary = (userId) => {
  return Chat.find({ userId }, { _id: 1, name: 1 }).sort({ updatedAt: -1 });
};

export const renameChatInDb = (chatId, userId, newName) => {
  return Chat.findOneAndUpdate(
    { _id: chatId, userId },
    { name: newName },
    { new: true, projection: { _id: 1, name: 1 } },
  );
};

export const deleteChatById = (chatId, userId) => {
  return Chat.findOneAndDelete({ _id: chatId, userId });
};
