import { spoonacularRequest } from "../../../libraries/services/spoonacular.js";
import { stripHtml } from "string-strip-html";
import {
  getRecipeInfoById,
  getSearchHistoryByUid,
  createUserEntryInUserSearchHistory,
  searchRecipesByCuisine,
} from "../db.js";
import { findRecipesByIds } from "../../favourite/db.js";
import { decodeFirebaseIdToken } from "../../../libraries/services/firebase.js";
import { fetchSaveFilterRecipes } from "../util/fetchHelper.js";

import {
  recipesByIngredientsHelper,
  recipesByTitleHelper,
} from "../util/searchHelper.js";

import {
  getDbSuggestions,
  getApiSuggestions,
} from "../util/autoCompleteHelper.js";

import { respondWithResults, mergeAndLimitResults } from "../util/formatter.js";

import { generateShoppingList } from "../util/shoppingList.js";

import mongoose from "mongoose";

/**
 * Search recipes by title
 * @param {*} req
 * @param {*} res
 * @returns
 */

export const searchRecipes = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(() => {
      return recipesByTitleHelper(req.query);
    })
    .then((results) => {
      return respondWithResults(res, results);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};

// Controller: Search Recipes by Ingredients

export const searchRecipesByIngredients = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(() => {
      return recipesByIngredientsHelper(req.query);
    })
    .then((results) => {
      return respondWithResults(res, results);
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};

// Controller: Get Recipe Information
export const getRecipeInformation = (req, res) => {
  const id = req.params.id.toString();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid recipe." });
  }

  let recipeData;

  getRecipeInfoById(id)
    .then((data) => {
      if (!data) {
        return Promise.reject(
          Object.assign(new Error("Recipe not found."), { code: 404 }),
        );
      }
      recipeData = data;
      return decodeFirebaseIdToken(req.headers.authorization);
    })
    .then(({ uid }) => {
      return updateUserSearchHistory(uid, id);
    })
    .then(() => {
      res.status(200).json(recipeData);
    })
    .catch((err) => {
      const status =
        err.code && [400, 401, 403, 404].includes(err.code) ? err.code : 500;
      const message = err.message || "Internal server error.";
      res.status(status).json({ error: message });
    });
};

// Controller: Get Recipe Summary
export const getRecipeSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getRecipeInfoById(id, "_id title summary");

    const plainTextSummary = stripHtml(data.summary).result;
    return res.status(200).json({
      id: data.id,
      title: data.title,
      summary: plainTextSummary, // Send plain text instead of HTML
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Controller: Get Similar Recipes
export const getSimilarRecipes = (req, res) => {
  const { id } = req.params;
  const { number = 20 } = req.query;

  getRecipeInfoById(id, "_id sourceId")
    .then((recipe) => {
      if (!recipe?.sourceId) {
        return res
          .status(404)
          .json({ error: "Recipe not found or missing sourceId." });
      }

      return spoonacularRequest(`/recipes/${recipe.sourceId}/similar`, {
        number,
      });
    })
    .then((similarRecipes) => {
      if (!similarRecipes || similarRecipes.length === 0) {
        return res.status(404).json({ results: [], totalResults: 0 });
      }

      const ids = similarRecipes.map((r) => r.id);

      return fetchSaveFilterRecipes(ids, {});
    })
    .then((recipes) => respondWithResults(res, recipes))
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};

// 🔍 Autocomplete Recipes
export const autoCompleteRecipes = (req, res) => {
  const { query, number = 5 } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  getDbSuggestions(query, number)
    .then((suggestions) => {
      if (suggestions.length >= number) {
        return res.status(200).json(suggestions.slice(0, number));
      }

      return getApiSuggestions(query, number, suggestions).then(
        (finalSuggestions) =>
          res.status(200).json(finalSuggestions.slice(0, number)),
      );
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(" Error in autoCompleteRecipes:", error);
      return res.status(500).json({ error: error.message });
    });
};

export const autoCompleteIngredients = (req, res) => {
  const { query, number = 5 } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  spoonacularRequest("/food/ingredients/autocomplete", { query, number })
    .then((data) => res.status(200).json(data))
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(" Error in autoCompleteIngredients:", error);
      return res.status(500).json({ error: error.message });
    });
};

export const getSearchesFromHistory = (req, res) => {
  let { n } = req.params;
  if (!numericValidator(n)) {
    return res.status(400).json({ error: "Invalid history query." });
  }

  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => {
      return getSearchHistoryByUid(uid);
    })
    .then((searchHistory) => {
      if (!searchHistory?.history?.length) {
        return res.status(200).json({ results: [] });
      }

      // Extract n unique recent history and fetch recipe details
      return getUniqueRecentHistoryWithRecipeInfo(
        searchHistory.history,
        n,
      ).then((responseHistory) => {
        return res.status(200).json({ results: responseHistory });
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};

const getUniqueRecentHistoryWithRecipeInfo = (history, n) => {
  const uniqueHistoryMap = new Map();
  let count = 0; // Keeps track of the number of unique recipes

  for (const { recipeId, searchedAt } of history) {
    if (!uniqueHistoryMap.has(recipeId)) {
      uniqueHistoryMap.set(recipeId, { recipeId, searchedAt });
      count++;
    }
    if (count >= n) break;
  }

  // Get the n most recent unique searches
  const recentUniqueSearches = Array.from(uniqueHistoryMap.values());

  // Retrieve recipe details for the selected recipeIds
  const recipeIds = recentUniqueSearches.map((entry) => entry.recipeId);
  return findRecipesByIds(recipeIds).then((recipes) => {
    const recipeMap = new Map(recipes.map((recipe) => [recipe.id, recipe]));

    return recentUniqueSearches.map(({ recipeId, searchedAt }) => ({
      searchedAt,
      ...(recipeMap.get(recipeId) || {
        id: recipeId,
        title: null,
        image: null,
        likes: 0,
        summary: null,
      }),
    }));
  });
};

const updateUserSearchHistory = (uid, recipeId) => {
  return getSearchHistoryByUid(uid)
    .then((searchHistory) => {
      if (searchHistory?.history) {
        searchHistory.history.unshift({
          recipeId: recipeId,
          searchedAt: Date.now(),
        });
        searchHistory.save();
      } else {
        createUserEntryInUserSearchHistory(uid, recipeId);
      }
    })
    .catch(() => {
      throw new Error("Failed to update search history");
    });
};

export const getShoppingList = (req, res) => {
  const { id } = req.params;
  const { requestedServing } = req.query;

  if (!requestedServing || isNaN(requestedServing)) {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'requestedServing' parameter." });
  }

  getRecipeInfoById(id)
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found." });
      }

      const shoppingList = generateShoppingList(
        recipe,
        Number(requestedServing),
      );
      return res.status(200).json({
        recipeId: id,
        servings: Number(requestedServing),
        shoppingList,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};

export const getRecipesByCuisine = (req, res) => {
  const { cuisine, number } = req.query;
  const limit = parseInt(number, 10) || 60;

  if (!cuisine) {
    return res.status(400).json({
      success: false,
      message: "Cuisine name is required.",
    });
  }

  searchRecipesByCuisine(cuisine, limit)
    .then((dbResults) => {
      if (dbResults.length >= limit) {
        return Promise.resolve(dbResults.slice(0, limit));
      }

      return spoonacularRequest("/recipes/complexSearch", {
        cuisine,
        number: limit,
      })
        .then((apiResponse) => {
          const ids = (apiResponse.results || []).map((r) => r.id);
          return fetchSaveFilterRecipes(ids, {});
        })
        .then((apiResults) =>
          mergeAndLimitResults(dbResults, apiResults, limit),
        );
    })
    .then((finalResults) => respondWithResults(res, finalResults))
    .catch(() => {
      return res.status(500).json({ success: false, message: "Server error." });
    });
};

export const numericValidator = (n) => {
  n = Number(n.toString());
  return Number.isInteger(n) && n > 0;
};
