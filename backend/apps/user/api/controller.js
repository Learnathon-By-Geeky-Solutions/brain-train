import crypto from "crypto";
import { findUserByUsername } from "../../../libraries/models/users.js";
import { decodeFirebaseIdToken } from "../../../libraries/services/firebase.js";
import { getSearchHistoryByUid, getRecipeInfoById } from "../../search/db.js";
import { getSimilarRecipesById, createNewSimilarRecipeEntry } from "../db.js";
import { findRecipesByIds } from "../../favourite/db.js";
import { spoonacularRequest } from "../../../libraries/services/spoonacular.js";
import { fetchSaveFilterRecipes } from "../../search/util/fetchHelper.js";

export const usernameValidator = (req, res) => {
  let { username } = req.body;
  username = username.toString().trim();
  const isValidUsername = /^[a-zA-Z][a-zA-Z0-9 _-]{3,29}$/.test(username);

  if (!isValidUsername) {
    return res
      .status(400)
      .json({ error: "Invalid username format", available: false });
  }

  findUserByUsername(username)
    .then((user) => {
      if (user) {
        return res
          .status(409)
          .json({ error: "Username already exists", available: false });
      }
      res.status(200).json({ message: "Username available", available: true });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

export const recipeRecommender = async (req, res) => {
  const RECOMMENDATION_LIMIT = 10;

  try {
    const { uid } = await decodeFirebaseIdToken(req.headers.authorization);
    const searchHistory = await getSearchHistoryByUid(uid);

    if (!searchHistory || searchHistory.history.length === 0) {
      return res.status(200).json({ results: [] });
    }

    const recommendations = await generateRecommendations(
      searchHistory.history,
      RECOMMENDATION_LIMIT,
    );

    return res.status(200).json({ results: recommendations });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const generateRecommendations = async (history, limit) => {
  const recipeCountMap = extractUniqueRecipeCounts(history.slice(0, limit));
  const proportionMap = calculateRecipeProportions(recipeCountMap);
  const selectedRecipeIds = new Set();

  const recommendationChunks = await Promise.all(
    Array.from(proportionMap.entries()).map(([recipeId, count]) =>
      getRecommendationsForRecipe(recipeId, count, selectedRecipeIds),
    ),
  );

  return recommendationChunks.flat().reverse().slice(0, limit);
};

const getRecommendationsForRecipe = async (
  recipeId,
  count,
  selectedRecipeIds,
) => {
  const similarData = await getSimilarRecipesById(recipeId);
  return similarData?.similarIds
    ? handleSimilarRecipes(similarData.similarIds, count, selectedRecipeIds)
    : handleSpoonacularFallback(recipeId, count, selectedRecipeIds);
};

const handleSimilarRecipes = (similarIds, count, selectedRecipeIds) => {
  const shuffled = shuffleArray(similarIds.map((r) => r.recipeId));
  const newIds = [];

  return new Promise((resolve, reject) => {
    try {
      for (const id of shuffled) {
        if (!selectedRecipeIds.has(id)) {
          newIds.push(id);
          selectedRecipeIds.add(id);
          if (newIds.length === count) break;
        }
      }

      findRecipesByIds(newIds)
        .then((recipes) => resolve(recipes))
        .catch((error) =>
          reject(error instanceof Error ? error : new Error(error)),
        );
    } catch (error) {
      reject(error instanceof Error ? error : new Error(error));
    }
  });
};

const handleSpoonacularFallback = async (
  recipeId,
  count,
  selectedRecipeIds,
) => {
  try {
    const originalRecipe = await getRecipeInfoById(
      recipeId,
      "_id sourceId isUploaded",
    );
    if (originalRecipe.isUploaded) return [];

    const spoonacularResults = await fetchSpoonacularSimilar(
      originalRecipe.sourceId,
    );
    const newIds = spoonacularResults
      .map((r) => r.id)
      .filter((id) => !selectedRecipeIds.has(id));

    if (newIds.length === 0) return [];

    const detailed = await fetchSaveFilterRecipes(newIds, {});
    const recipes = mapDetailedRecipes(detailed);

    await createNewSimilarRecipeEntry(
      recipeId,
      detailed.map((r) => r.id),
    );
    recipes.forEach((r) => selectedRecipeIds.add(r.id));

    return shuffleArray(recipes).slice(0, count);
  } catch {
    return [];
  }
};

const fetchSpoonacularSimilar = (sourceId) =>
  spoonacularRequest(`/recipes/${sourceId}/similar`, {
    RECOMMENDATION_LIMIT: 10,
  });

const mapDetailedRecipes = (detailedRecipes) => {
  return detailedRecipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    summary: recipe.summary,
    likes: recipe.likes,
    image: recipe.image,
  }));
};

const shuffleArray = (array) =>
  array.sort(() => crypto.randomBytes(4).readUInt32LE(0) / 0xffffffff - 0.5);

const extractUniqueRecipeCounts = (history) => {
  const map = new Map();
  history.forEach(({ recipeId }) => {
    map.set(recipeId, (map.get(recipeId) || 0) + 1);
  });
  return map;
};

const calculateRecipeProportions = (recipeCountMap) => {
  const total = Array.from(recipeCountMap.values()).reduce(
    (sum, c) => sum + c,
    0,
  );
  const limit = 10;
  const map = new Map();
  let remaining = limit;

  const entries = Array.from(recipeCountMap.entries()).reverse();
  for (let i = 0; i < entries.length - 1; i++) {
    const [recipeId, count] = entries[i];
    const proportion = Math.floor((count / total) * limit);
    map.set(recipeId, proportion);
    remaining -= proportion;
  }

  const [lastId] = entries[entries.length - 1];
  map.set(lastId, remaining);

  return map;
};
