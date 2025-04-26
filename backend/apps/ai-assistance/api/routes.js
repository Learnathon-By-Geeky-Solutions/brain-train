import express from "express";
import { upload, handleMulterErrors } from "../middleware/multerUpload.js";
import { validateImageUpload } from "../middleware/validateUpload.js";
import { validateObjectId } from "../middleware/dbQueryValidator.js";
import {
  analyzeImageIngredients,
  analyzeImageRecipe,
  sendChatMessage,
  getUserAllChatsList,
  getChatDetailsById,
  renameChatById,
  deleteChat,
  getUserUploads,
} from "./controller.js";

const router = express.Router();

/**
 * @swagger
 * /ai/analyze/ingredients:
 *   post:
 *     summary: Analyze an image to detect ingredients and suggest matching recipes
 *     description: Accepts an image, detects ingredients, and returns a list of matching recipes.
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully analyzed the image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       confidence:
 *                         type: number
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       image:
 *                         type: string
 *                       summary:
 *                         type: string
 *                       likes:
 *                         type: number
 *                 totalResults:
 *                   type: number
 *       400:
 *         description: Bad request (e.g., no image, unsupported file type, file too large)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error (e.g., service not implemented or failed)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post(
  "/analyze/ingredients",
  handleMulterErrors(upload.single("image")),
  validateImageUpload,
  analyzeImageIngredients,
);

/**
 * @swagger
 * /ai/analyze/food:
 *   post:
 *     summary: Analyze a food image to extract nutrition and suggest recipes
 *     description: Accepts a food image, performs image classification, estimates nutritional content, and returns relevant recipe suggestions.
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image of food/groceries
 *     responses:
 *       200:
 *         description: Nutrition analysis and recipe suggestions returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrl:
 *                   type: string
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     probability:
 *                       type: number
 *                 nutrition:
 *                   type: object
 *                   properties:
 *                     recipesUsed:
 *                       type: number
 *                     calories:
 *                       $ref: '#/components/schemas/Nutrient'
 *                     fat:
 *                       $ref: '#/components/schemas/Nutrient'
 *                     protein:
 *                       $ref: '#/components/schemas/Nutrient'
 *                     carbs:
 *                       $ref: '#/components/schemas/Nutrient'
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       image:
 *                         type: string
 *                       summary:
 *                         type: string
 *                 totalResults:
 *                   type: number
 *       400:
 *         description: No image provided or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * components:
 *   schemas:
 *     Nutrient:
 *       type: object
 *       properties:
 *         value:
 *           type: number
 *         unit:
 *           type: string
 *         confidenceRange95Percent:
 *           type: object
 *           properties:
 *             min:
 *               type: number
 *             max:
 *               type: number
 *         standardDeviation:
 *           type: number
 */
router.post(
  "/analyze/food",
  handleMulterErrors(upload.single("image")),
  validateImageUpload,
  analyzeImageRecipe,
);

/**
 * @swagger
 * /ai/chat:
 *   post:
 *     summary: Initiate or continue a chat with AI based on user input and optional image.
 *     description: Creates a new chat session or continues an existing one by providing a text prompt and an optional image.
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: text
 *         type: string
 *         description: The message text to send to the assistant.
 *       - in: formData
 *         name: image
 *         type: file
 *         required: false
 *         description: Optional image input for context.
 *       - in: formData
 *         name: chatId
 *         type: string
 *         required: false
 *         description: Existing chat ID to continue the conversation.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional query type (e.g., `google` for special processing).
 *     responses:
 *       200:
 *         description: Successful response with updated chat messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatId:
 *                   type: string
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       role:
 *                         type: string
 *                       text:
 *                         type: string
 *       400:
 *         description: Bad request (e.g., missing text in certain types).
 *       500:
 *         description: Internal server error or invalid chat ID.
 */
router.post(
  "/chat",
  handleMulterErrors(upload.single("image")),
  sendChatMessage,
);

/**
 * @swagger
 * /ai/uploads:
 *   get:
 *     summary: Get a list of uploaded food images
 *     description: Returns metadata or filenames of images uploaded for food analysis.
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of uploaded images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uploads:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/uploads", getUserUploads);

/**
 * @swagger
 * /ai/chat/list:
 *   get:
 *     summary: Get list of all user chat sessions.
 *     description: Fetches a list of all chat sessions for the authenticated user.
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully returns a list of chat metadata.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 */
router.get("/chat/list", getUserAllChatsList);

/**
 * @swagger
 * /ai/chat/{chatId}:
 *   get:
 *     summary: Retrieve a specific chat session by ID
 *     description: Fetches a chat session including all associated messages for the provided `chatId`.
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the chat session
 *     responses:
 *       200:
 *         description: Successfully returns the chat object with messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       role:
 *                         type: string
 *                       text:
 *                         type: string
 *                       status:
 *                         type: string
 *       400:
 *         description: Invalid chat ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Chat not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/chat/:chatId", validateObjectId, getChatDetailsById);

/**
 * @swagger
 * /ai/chat/{chatId}/rename:
 *   patch:
 *     summary: Rename an existing chat
 *     description: Allows authenticated users to rename a specific chat by ID.
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chat to rename
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Chat Title"
 *     responses:
 *       200:
 *         description: Chat renamed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *       400:
 *         description: Invalid chat ID or missing name
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Chat not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Unauthorized or internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.patch("/chat/:chatId/rename", validateObjectId, renameChatById);

/**
 * @swagger
 * /ai/chat/{chatId}:
 *   delete:
 *     summary: Delete a specific chat session
 *     description: Deletes a chat session by its `chatId`. Only accessible to authenticated users.
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the chat session to delete
 *     responses:
 *       200:
 *         description: Chat deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chat deleted
 *                 chatId:
 *                   type: string
 *       400:
 *         description: Invalid chatId format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Chat not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error for unauthenticated or other issues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.delete("/chat/:chatId", validateObjectId, deleteChat);

export default router;
