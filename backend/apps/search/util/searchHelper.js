import { getRecipesByIngredients, getRecipeFieldsByTitle } from "../db.js";
import { filterRecipes } from "./filtering.js";
import {
  fetchByIngredientSaveFilter,
  fetchByTitleSaveFilter,
} from "./fetchHelper.js";
import { mergeAndLimitResults } from "./formatter.js";

export const recipesByIngredientsHelper = (query) => {
  const { number = 60, ingredients, fields = "", ...filters } = query;

  if (!ingredients) {
    return Promise.reject(new Error("'ingredients' parameter is required."));
  }

  const fieldsArray = fields
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  return getRecipesByIngredients(ingredients, fieldsArray, number)
    .then((dbResults) => {
      return filterRecipes(dbResults, filters);
    })
    .then((filteredDbResults) => {
      const threshold = Math.ceil(number * 0.5);

      if (filteredDbResults.length >= threshold) {
        return Promise.resolve(filteredDbResults);
      }

      return fetchByIngredientSaveFilter(ingredients, number, filters).then(
        (filteredApiResults) =>
          mergeAndLimitResults(filteredDbResults, filteredApiResults, number),
      );
    });
};

/**
 * Search recipes by title (DB + API fallback) and apply filters.
 * @param {Object} query - Express-style req.query object
 * @returns {Promise<Array>} - Final list of recipes
 */
export const recipesByTitleHelper = (query) => {
  const { number = 60, fields = "", ...params } = query;
  const { query: titleQuery, ...filters } = params;

  const fieldsArray = fields
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  return getRecipeFieldsByTitle(titleQuery, fieldsArray, number).then(
    (dbResults) =>
      filterRecipes(dbResults, filters).then((filteredDbResults) => {
        const threshold = Math.ceil(number * 0.5);

        if (filteredDbResults.length >= threshold) {
          return Promise.resolve(filteredDbResults);
        }

        return fetchByTitleSaveFilter(titleQuery, number, filters).then(
          (filteredApiResults) =>
            mergeAndLimitResults(filteredDbResults, filteredApiResults, number),
        );
      }),
  );
};
