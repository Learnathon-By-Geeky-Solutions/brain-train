import { UserImageLog } from "../../libraries/models/userImageLog.js";

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
