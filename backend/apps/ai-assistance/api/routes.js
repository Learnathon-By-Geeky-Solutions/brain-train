import express from "express";
import { upload, handleMulterErrors } from "../middleware/multerUpload.js";
import { validateImageUpload } from "../middleware/validateUpload.js";
import {
  analyzeImageIngredients,
  analyzeImageRecipe,
  sendChatMessage,
  getUserAllChatsList,
  getChatDetailsById,
  renameChatById,
  deleteChat,
} from "./controller.js";

const router = express.Router();

router.post(
  "/analyze/ingredients",
  handleMulterErrors(upload.single("image")),
  validateImageUpload,
  analyzeImageIngredients,
);

router.post(
  "/analyze/food",
  handleMulterErrors(upload.single("image")),
  validateImageUpload,
  analyzeImageRecipe,
);

router.post(
  "/chat",
  handleMulterErrors(upload.single("image")),
  sendChatMessage,
);

router.get("/chat/list", getUserAllChatsList);
router.get("/chat/:chatId", getChatDetailsById);
router.patch("/chat/:chatId/rename", renameChatById);
router.delete("/chat/:chatId", deleteChat);

export default router;
