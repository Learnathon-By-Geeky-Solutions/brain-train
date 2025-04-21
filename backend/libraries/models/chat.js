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
