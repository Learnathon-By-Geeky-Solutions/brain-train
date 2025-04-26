/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         role:
 *           type: string
 *           enum:
 *             - user
 *             - assistant
 *           description: The role of the message sender.
 *         text:
 *           type: string
 *           description: The text content of the message.
 *         files:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of file URLs (e.g., Firebase Storage links).
 *         status:
 *           type: string
 *           enum:
 *             - complete
 *             - streaming
 *             - failed
 *           description: The status of the message.
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of the message.
 */
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    files: {
      type: [String], // URLs (e.g., Firebase Storage links)
      default: [],
    },
    status: {
      type: String,
      enum: ["complete", "streaming", "failed"],
      default: "complete",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
); // Optional: prevent subdocument _id bloat

export default MessageSchema;
