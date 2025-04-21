import { VisionFactory } from "../../../libraries/services/vision-service/visionFactory.js";

import {
  uploadToFirebase,
  decodeFirebaseIdToken,
} from "../../../libraries/services/firebase.js";
import {
  logUserImageUpload,
  getUserAllChatsSummary,
  getChatById,
  renameChatInDb,
  deleteChatById,
  getUserImageUploads,
} from "../db.js";

import {
  handleUserMessage,
  generateAssistantResponse,
  saveChatAndRespond,
} from "../util/chatHelper.js";

import { formatRecipes } from "../../search/util/formatter.js";
import { recipesByIngredientsHelper } from "../../search/util/searchHelper.js";
import { fetchSaveFilterRecipes } from "../../search/util/fetchHelper.js";

import { spoonacularRequest } from "../../../libraries/services/spoonacular.js";

export const analyzeImageIngredients = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => {
      return uploadToFirebase(req.file).then((imageUrl) => ({ uid, imageUrl }));
    })
    .then(({ uid, imageUrl }) => {
      const base64 = req.file.buffer
        .toString("base64")
        .replace(/^data:image\/\w+;base64,/, "");

      const type = req.query.type || "clarifai"; // default to "clarifai"

      const aiService = VisionFactory.create(type);
      return aiService
        .analyzeImage(base64)
        .then((ingredients) => ({ uid, imageUrl, ingredients }));
    })
    .then(({ uid, imageUrl, ingredients }) => {
      const ingredientNames = ingredients
        .sort((a, b) => b.confidence - a.confidence) // sort by confidence, descending
        .slice(0, 5) // take top 5
        .map((i) => i.name);
      const filters = req.query || {};

      return recipesByIngredientsHelper({
        ingredients: ingredientNames.join(","),
        number: filters.number || 10,
        ...filters,
      }).then((recipes) => ({
        uid,
        imageUrl,
        ingredients,
        recipes,
      }));
    })
    .then(({ uid, imageUrl, ingredients, recipes }) => {
      return logUserImageUpload(uid, imageUrl).then(() => {
        const formatted = formatRecipes(recipes);
        res.status(200).json({
          imageUrl,
          ingredients,
          results: formatted,
          totalResults: formatted.length,
        });
      });
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(" analyzeImageIngredients error:", err.message);
      res.status(500).json({ error: "Image analysis failed" });
    });
};

export const analyzeImageRecipe = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => {
      return uploadToFirebase(req.file).then((imageUrl) => ({ uid, imageUrl }));
    })
    .then(({ uid, imageUrl }) => {
      return spoonacularRequest("/food/images/analyze", { imageUrl }).then(
        (spoonacularData) => ({ uid, imageUrl, spoonacularData }),
      );
    })
    .then(({ uid, imageUrl, spoonacularData }) => {
      const recipeIds = (spoonacularData.recipes || []).map((r) => r.id);
      if (!recipeIds.length) {
        return res
          .status(200)
          .json({ imageUrl, spoonacularData, results: [], totalResults: 0 });
      }

      const filters = req.query || {};

      return fetchSaveFilterRecipes(recipeIds, filters).then(
        (enrichedRecipes) => {
          const formatted = formatRecipes(enrichedRecipes);

          // Optional DB log
          return logUserImageUpload(uid, imageUrl).then(() => {
            res.status(200).json({
              imageUrl,
              category: spoonacularData.category,
              nutrition: spoonacularData.nutrition,
              results: formatted,
              totalResults: formatted.length,
            });
          });
        },
      );
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(" analyzeImageRecipe Error:", err.message);
      res.status(500).json({ error: "Image analysis failed" });
    });
};

export const sendChatMessage = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => handleUserMessage(req, uid))
    .then(({ chatId, userMessage, uid, type }) =>
      generateAssistantResponse(chatId, userMessage, type).then(
        ({ assistantMessage }) =>
          saveChatAndRespond(res, chatId, uid, userMessage, assistantMessage),
      ),
    )
    .catch((err) => {
      console.error(" LLM Chat Error:", err.message);
      res.status(500).json({ error: "Chat failed" });
    });
};

export const getUserAllChatsList = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => getUserAllChatsSummary(uid))
    .then((chats) => res.status(200).json({ chats }))
    .catch((err) => {
      console.error("Failed to fetch user chats:", err.message);
      res.status(500).json({ error: "Could not fetch user chats" });
    });
};

export const getChatDetailsById = (req, res) => {
  const { chatId } = req.params;

  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) =>
      getChatById(chatId).then((chat) => {
        if (!chat || chat.userId !== uid) {
          return res
            .status(404)
            .json({ error: "Chat not found or access denied" });
        }

        const { _id, name, messages } = chat;
        return res.status(200).json({ _id, name, messages });
      }),
    )
    .catch((err) => {
      console.error("Error fetching chat details:", err.message);
      res.status(500).json({ error: "Failed to retrieve chat details" });
    });
};

export const renameChatById = (req, res) => {
  const { chatId } = req.params;
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Valid chat name is required" });
  }

  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => renameChatInDb(chatId, uid, name))
    .then((updatedChat) => {
      if (!updatedChat) {
        return res
          .status(404)
          .json({ error: "Chat not found or access denied" });
      }
      return res.status(200).json(updatedChat);
    })
    .catch((err) => {
      console.error(" Rename chat error:", err.message);
      return res.status(500).json({ error: "Failed to rename chat" });
    });
};

export const deleteChat = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => {
      const chatId = req.params.chatId;

      return deleteChatById(chatId, uid).then((deletedChat) => {
        if (!deletedChat) {
          return res
            .status(404)
            .json({ error: "Chat not found or unauthorized" });
        }
        return res.status(200).json({ message: "Chat deleted", chatId });
      });
    })
    .catch((err) => {
      console.error("Delete chat error:", err.message);
      res.status(500).json({ error: "Failed to delete chat" });
    });
};

export const getUserUploads = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => getUserImageUploads(uid))
    .then((uploads) => {
      res.status(200).json({ uploads });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "Could not fetch user uploads" + err.message });
    });
};
