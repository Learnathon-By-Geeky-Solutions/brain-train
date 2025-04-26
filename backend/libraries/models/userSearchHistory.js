/**
 * @swagger
 * components:
 *   schemas:
 *     UserSearchHistory:
 *       type: object
 *       properties:
 *         firebaseUid:
 *           type: string
 *           description: The Firebase UID of the user.
 *         history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Search'
 *           description: The search history of the user.
 *       required:
 *         - firebaseUid
 */
import mongoose from "mongoose";
import searchSchema from "./searches.js";

const userSearhHistorySchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
  },
  history: [searchSchema],
});

const UserSearchHistory = mongoose.model(
  "UserSearchHistory",
  userSearhHistorySchema,
);

export default UserSearchHistory;

export const deleteSearchHistory = async (uid) => {
  await UserSearchHistory.deleteOne({ firebaseUid: uid });
};
