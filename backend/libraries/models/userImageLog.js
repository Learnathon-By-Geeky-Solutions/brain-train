/**
 * @swagger
 * components:
 *   schemas:
 *     UserImageLog:
 *       type: object
 *       required:
 *         - userId
 *         - imageUrl
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user who uploaded the image.
 *         imageUrl:
 *           type: string
 *           description: The URL of the uploaded image.
 *         uploadedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the image was uploaded. Defaults to the current date and time.
 */

import mongoose from "mongoose";

const UserImageLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export const UserImageLog = mongoose.model("UserImageLog", UserImageLogSchema);
