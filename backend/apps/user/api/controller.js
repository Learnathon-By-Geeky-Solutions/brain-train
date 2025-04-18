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
      console.error("Username validation error:", error.message);
      res.status(500).json({ error: "Internal server error" });
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
    console.error("Error in recipeRecommender:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const generateRecommendations = async (history, limit) => {
  const uniqueRecipeMap = extractUniqueRecipeCounts(history.slice(0, limit));
  const recipeProportions = calculateRecipeProportions(uniqueRecipeMap);
  const selectedRecipeIds = new Set();
  const recommendations = [];

  for (const [recipeId, count] of recipeProportions) {
    const similarRecipes = await getSimilarRecipesById(recipeId);
    if (similarRecipes?.similarIds) {
      recommendations.push(
        ...(await handleSimilarRecipes(
          similarRecipes.similarIds,
          count,
          selectedRecipeIds,
        )),
      );
    } else {
      recommendations.push(
        ...(await handleSpoonacularFallback(
          recipeId,
          count,
          selectedRecipeIds,
        )),
      );
    }
  }

  recommendations.reverse();
  return recommendations.slice(0, 10);
};

const handleSimilarRecipes = (similarIds, count, selectedRecipeIds) => {
  const shuffled = similarIds.sort(() => {
    return crypto.randomBytes(4).readUInt32LE(0) / 0xffffffff - 0.5;
  });
  const selectedRecipeIdsForCurrentRecipe = [];

  // Process recipes and add them to selectedRecipeIdsForCurrentRecipe
  return new Promise((resolve) => {
    let processedCount = 0;
    for (const recipe of shuffled) {
      if (selectedRecipeIds.has(recipe.recipeId)) continue;

      selectedRecipeIdsForCurrentRecipe.push(recipe.recipeId);
      selectedRecipeIds.add(recipe.recipeId);

      if (++processedCount === count) break; // Stop once the desired count is reached
    }

    // Fetch recipes by their IDs
    resolve(findRecipesByIds(selectedRecipeIdsForCurrentRecipe));
  });
};

/**
 * Handles the fallback mechanism for fetching similar recipes from Spoonacular.
 *
 * @param {string} recipeId - The ID of the recipe to find similar recipes for.
 * @param {number} count - The number of similar recipes to return.
 * @param {Set<string>} selectedRecipeIds - A set of recipe IDs that have already been selected.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of similar recipes with specific fields.
 */
const handleSpoonacularFallback = (recipeId, count, selectedRecipeIds) => {
  const RECOMMENDATION_LIMIT = 10;

  return getRecipeInfoById(recipeId, "_id sourceId isUploaded")
    .then((currentRecipe) => {
      if (currentRecipe.isUploaded === true) return Promise.resolve([]); // Skip if the recipe is uploaded

      return spoonacularRequest(`/recipes/${currentRecipe.sourceId}/similar`, {
        RECOMMENDATION_LIMIT,
      });
    })
    .then((similarRecipes) => {
      let similarRecipeIds = similarRecipes
        .map((recipe) => recipe.id)
        .filter((id) => !selectedRecipeIds.has(id));

      if (similarRecipeIds.length === 0) return { detailedRecipes: [] }; // No similar recipes found

      return fetchSaveFilterRecipes(similarRecipeIds, {}).then(
        (detailedRecipes) => ({ detailedRecipes, similarRecipeIds }),
      );
    })
    .then(({ detailedRecipes }) => {
      const recipesWithSpecificFields = mapDetailedRecipes(detailedRecipes);
      const similarRecipeIds = detailedRecipes.map((recipe) => recipe.id);
      return createNewSimilarRecipeEntry(recipeId, similarRecipeIds).then(
        () => recipesWithSpecificFields,
      );
    })
    .then((recipesWithSpecificFields) => {
      // Shuffle and slice the recommendations to the desired count
      return recipesWithSpecificFields
        .sort(() => {
          return crypto.randomBytes(4).readUInt32LE(0) / 0xffffffff - 0.5;
        })
        .slice(0, count);
    })
    .catch((error) => {
      console.error("Error in handleSpoonacularFallback:", error);
      return []; // Return empty array on error
    });
};

const mapDetailedRecipes = (detailedRecipes) => {
  return detailedRecipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    summary: recipe.summary,
    likes: recipe.likes,
    image: recipe.image,
  }));
};

/**
 * Extracts the count of unique recipes from the user's history.
 *
 * @param {Array} history - An array of objects representing the user's history, where each object contains a `recipeId`.
 * @returns {Map} A map where the keys are unique recipe IDs and the values are the counts of how many times each recipe appears in the history.
 */
const extractUniqueRecipeCounts = (history) => {
  const uniqueRecipeMap = new Map();
  history.forEach(({ recipeId }) => {
    uniqueRecipeMap.set(recipeId, (uniqueRecipeMap.get(recipeId) || 0) + 1);
  });
  return uniqueRecipeMap;
};

/**
 * Calculates the proportions of recipe recommendations based on the number of searches.
 *
 * @param {Map<string, number>} uniqueRecipeMap - A map where the keys are recipe IDs and the values are the number of searches for each recipe.
 * @returns {Map<string, number>} A map where the keys are recipe IDs and the values are the calculated proportions of recommendations.
 */
const calculateRecipeProportions = (uniqueRecipeMap) => {
  const totalSearches = Array.from(uniqueRecipeMap.values()).reduce(
    (sum, count) => sum + count,
    0,
  );
  const RECOMMENDATION_LIMIT = 10;
  const proportionMap = new Map();
  let remaining = RECOMMENDATION_LIMIT;

  // Convert to an array and iterate in reverse order
  const entries = Array.from(uniqueRecipeMap.entries()).reverse();

  for (let i = 0; i < entries.length - 1; i++) {
    const [recipeId, count] = entries[i];
    const proportion = Math.floor(
      (count / totalSearches) * RECOMMENDATION_LIMIT,
    );
    proportionMap.set(recipeId, proportion);
    remaining -= proportion;
  }

  // Assign remaining recommendations to the last recipe
  const [lastRecipeId] = entries[entries.length - 1];
  proportionMap.set(lastRecipeId, remaining);

  return proportionMap;
};
