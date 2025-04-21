// middlewares/validateObjectId.js
import mongoose from "mongoose";

export const validateObjectId = (req, res, next) => {
  const { chatId } = req.params;
  if (!mongoose.isValidObjectId(chatId)) {
    return res.status(400).json({ error: "Invalid chat ID" });
  }
  next();
};
