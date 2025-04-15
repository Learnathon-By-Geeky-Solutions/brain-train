import { spoonacularRequest } from '../../../libraries/services/spoonacular.js';
import{ saveRecipeDetails,getRecipeBySourceId } from '../db.js';
import { filterRecipes } from './filter.js';





/**
 * Fetch detailed information for multiple recipes using Spoonacular's /recipes/informationBulk.
 * @param {Array<string>} recipeIds - List of recipe IDs.
 * @returns {Promise<Array<Object>>} - Full recipe details including nutrition, cuisine, diets, etc.
 */
export const fetchRecipeDetailsBulk = (recipeIds) => {
  if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
    return Promise.resolve([]);
  }

  const recipeIdsString = recipeIds.join(",");
  console.log("Fetching full recipes for IDs:", recipeIdsString);

  return spoonacularRequest("/recipes/informationBulk", {
    ids: recipeIdsString,
    includeNutrition: true
  })
    .then((fullRecipes) => {
      console.log("Fetched full recipes:", fullRecipes.length);
      return fullRecipes;
    })
    .catch((error) => {
      console.error("Error fetching recipe details:", error);
      return [];
    });
};



/**
 * Fetch recipes by IDs from Spoonacular, enrich them if missing, save to DB, and return all filtered.
 * @param {string[]} recipeIds - Array of Spoonacular recipe IDs.
 * @param {Object} filters - Optional filters for post-processing.
 * @returns {Promise<Object[]>} - Filtered and enriched recipes.
 */
export const fetchSaveFilterRecipes = (recipeIds, filters = {}) => {
    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
      return Promise.resolve([]);
    }
  
    return getRecipeBySourceId(recipeIds)
      .then((existing) => enrichMissingRecipes(recipeIds, existing))   //getRecipeBySourceId will return the recipes already in DB, and enrichMissingRecipes will fetch the missing ones from Spoonacular and save them to DB
      .then(({ all }) => filterRecipes(all, filters))   // all will be the combined list of existing and newly fetched recipes returned by enrichMissingRecipes
      .then((filtered) => {
        console.log("✅ Filtered Recipes:", filtered.length);
        return filtered;
      });
  };
  
  /**
   * Enrich missing recipes by fetching and saving them.
   * @param {string[]} recipeIds - All requested IDs.
   * @param {Object[]} existing - Recipes already in DB.
   * @returns {Promise<{ all: Object[] }>} - Combined enriched recipes.
   */
  const enrichMissingRecipes = (recipeIds, existing) => {
    const existingIds = new Set(existing.map(r => String(r.sourceId)));
    const missingIds = recipeIds.filter(id => !existingIds.has(String(id)));
  
    if (missingIds.length === 0) {
      return Promise.resolve({ all: normalizeIds(existing) });
    }
  
    return fetchRecipeDetailsBulk(missingIds)
      .then((details) => saveAndEnrich(details))
      .then((saved) => ({
        all: normalizeIds([...existing, ...saved])
      }))
      .catch((err) => {
        console.error("❌ Error enriching recipes:", err);
        return { all: normalizeIds(existing) };
      });
  };
  
  /**
   * Save detailed recipes and return enriched versions.
   * @param {Object[]} recipes - Detailed recipes from Spoonacular.
   * @returns {Promise<Object[]>} - Saved recipe data.
   */
  const saveAndEnrich = (recipes) =>
    Promise.all(
      recipes.map((r) =>
        saveRecipeDetails(r)
          .then((saved) => ({
            ...saved,
            id: String(saved._id),
            sourceId: String(saved.sourceId)
          }))
          .catch((err) => {
            console.error("⚠️ Failed to save recipe:", r.id, err);
            return null;
          })
      )
    ).then((results) => results.filter(Boolean));
  
  /**
   * Normalize recipe IDs for frontend compatibility.
   * @param {Object[]} recipes - List of DB recipes.
   * @returns {Object[]} - Recipes with stringified `id`.
   */
  const normalizeIds = (recipes) =>
    recipes.map((r) => ({
      ...r,
      id: r._id?.toString() || r.id
    }));
  



  





  export const minimizeRecipeData = (recipes) => {
    return recipes.map(recipe => ({
      _id: recipe._id || recipe.id,
      id: recipe._id || recipe.id,
      title: recipe.title,
      image: recipe.image,
      summary: recipe.summary,
      likes: recipe.likes
    }));
  };
  