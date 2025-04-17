import { spoonacularRequest } from "../../../libraries/services/spoonacular.js";
import { stripHtml } from "string-strip-html";
import {
  getRecipeInfoById,
  getSearchHistoryByUid,
  createUserEntryInUserSearchHistory,
  getRecipeFieldsByTitle,
  getRecipesByIngredients,
  searchRecipesByCuisine,
} from "../db.js";
import { findRecipesByIds } from "../../favourite/db.js";
import { decodeFirebaseIdToken } from "../../../libraries/services/firebase.js";
import {
  fetchSaveFilterRecipes,
  fetchByTitleSaveFilter,
  fetchByIngredientSaveFilter,
} from "../util/fetchHelper.js";

import { respondWithResults, mergeAndLimitResults } from "../util/formatter.js";

import {
  getDbSuggestions,
  getApiSuggestions,
} from "../util/autoCompleteHelper.js";

import { filterRecipes } from "../util/filtering.js";

import { generateShoppingList } from "../util/shoppingList.js";

import mongoose from "mongoose";

/**
 * Search recipes by title
 * @param {*} req
 * @param {*} res
 * @returns
 */

export const searchRecipes = async (req, res) => {
  try {
    await decodeFirebaseIdToken(req.headers.authorization);

    const { number = 60, fields = "", ...params } = req.query;
    const { query, ...filters } = params;
    const fieldsArray = fields
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    getRecipeFieldsByTitle(query, fieldsArray, number)
      .then((dbResults) =>
        filterRecipes(dbResults, filters).then((filteredDbResults) => {
          const threshold = Math.ceil(number * 0.5);
          if (filteredDbResults.length >= threshold) {
            console.log("DB results are sufficient:", filteredDbResults.length);

            return respondWithResults(res, filteredDbResults);
          }

          return fetchByTitleSaveFilter(query, number, filters).then(
            (filteredApiResults) => {
              const combined = mergeAndLimitResults(
                filteredDbResults,
                filteredApiResults,
                number,
              );
              return respondWithResults(res, combined);
            },
          );
        }),
      )
      .catch((err) => {
        console.error("Error in searchRecipes:", err);
        return res.status(500).json({ error: err.message });
      });
  } catch (error) {
    console.error("Auth or input error:", error);
    return res.status(401).json({ error: error.message });
  }
};

// Controller: Search Recipes by Ingredients

export const searchRecipesByIngredients = async (req, res) => {
  try {
    await decodeFirebaseIdToken(req.headers.authorization);

    const { number = 60, ingredients, fields = "", ...filters } = req.query;

    if (!ingredients) {
      return res
        .status(400)
        .json({ error: "'ingredients' parameter is required." });
    }

    const fieldsArray = fields
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    // Step 1: Search in DB
    getRecipesByIngredients(ingredients, fieldsArray, number, filters)
      .then((dbResults) => {
        console.log("🔍 DB Results Before Filtering:", dbResults.length);
        return filterRecipes(dbResults, filters);
      })
      .then((filteredDbResults) => {
        console.log("🔎 DB Results After Filtering:", filteredDbResults.length);

        const threshold = Math.ceil(number * 0.5);

        if (filteredDbResults.length >= threshold) {
          return respondWithResults(res, filteredDbResults);
        }

        // Step 2: Fallback to API
        return fetchByIngredientSaveFilter(ingredients, number, filters).then(
          (filteredApiResults) => {
            const combined = mergeAndLimitResults(
              filteredDbResults,
              filteredApiResults,
              number,
            );
            return respondWithResults(res, combined);
          },
        );
      })
      .catch((err) => {
        console.error("❌ DB or filter error:", err);
        return res.status(500).json({ error: err.message });
      });
  } catch (error) {
    console.error("❌ Auth or input error:", error);
    return res.status(401).json({ error: error.message });
  }
};

// Controller: Get Recipe Information
export const getRecipeInformation = (req, res) => {
  const id = req.params.id.toString();
  // console.log("Information",id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    // console.log("Invalid Recipe id");
    return res.status(400).json({ error: "Invalid recipe" });
  }

  getRecipeInfoById(id)
    .then((data) => {
      if (!data) {
        return res.status(404).json({ error: "Recipe not found." });
      }

      decodeFirebaseIdToken(req.headers.authorization)
        .then(({ uid }) => {
          updateUserSearchHistory(uid, id)
            .then(() => {
              return res.status(200).json(data);
            })
            .catch((error) => {
              return res.status(500).json({ error: error.message });
            });
        })
        .catch((error) => {
          return res.status(500).json({ error: error.message });
        });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
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
      console.log(" Similar Spoonacular IDs:", ids);

      return fetchSaveFilterRecipes(ids, {});
    })
    .then((recipes) => respondWithResults(res, recipes))
    .catch((error) => {
      console.error(" Error in getSimilarRecipes:", error);
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
        console.warn(" Recipe not found:", id);
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
      console.error(" Error generating shopping list:", error);
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
        return dbResults.slice(0, limit);
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
    .catch((err) => {
      return res.status(500).json({ success: false, message: "Server error." });
    });
};

export const numericValidator = (n) => {
  n = Number(n.toString());
  return Number.isInteger(n) && n > 0;
};
