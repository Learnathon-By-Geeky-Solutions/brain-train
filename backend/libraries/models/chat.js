/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the chat.
 *         userId:
 *           type: string
 *           description: The Firebase UID of the user.
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *           description: List of messages in the chat.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the chat was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the chat was last updated.
 */
import mongoose from "mongoose";
import MessageSchema from "./message.js";

const ChatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: () =>
        `Chat - ${new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}`,
    },
    userId: {
      type: String, // Firebase UID
      required: true,
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// Fast querying by user
ChatSchema.index({ userId: 1, createdAt: -1 });

export const Chat = mongoose.model("Chat", ChatSchema);
