import { spoonacularRequest } from '../../../libraries/services/spoonacular.js';
import { stripHtml } from 'string-strip-html'; 
import { 
    getRecipeFieldsByParams,
    saveRecipeDetails,
    getRecipeInfoById,
    getSearchHistoryByUid,
    createUserEntryInUserSearchHistory
} from '../db.js';
import { findRecipesByIds } from '../../favourite/db.js';
import { decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';
import mongoose from 'mongoose';

/**
 * Search recipes by title
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const searchRecipes = async (req, res) => {
    try {
        await decodeFirebaseIdToken(req.headers.authorization);
        const { number = 10, fields = "" , ...params } = req.query;

        // Convert "fields" query string into an array (e.g., "summary,likes,nutrition")
        const fieldsArray = fields ? fields.split(',').map(field => field.trim()) : [];
        const conditions = { ...params };

        // Query db with params, fields and limit
        const dbResults = await  getRecipeFieldsByParams(conditions, fieldsArray, number);
        if (dbResults.length > 0) {
            return res.status(200).json({ results: dbResults, totalResults: dbResults.length });
        }

        // Fetch recipes
        const recipesData = await spoonacularRequest('/recipes/complexSearch', { number, ...params });

        // Enrich recipes with requested fields
        const enrichedRecipes = await enrichRecipesWithFields(recipesData.results, fieldsArray);

        // Save recipe details to the database
        await Promise.all(
            enrichedRecipes.map(async (recipe) => {
                const details = await spoonacularRequest(`/recipes/${recipe.id}/information`);
                const savedRecipe = await saveRecipeDetails(details);
        
                // Update the enrichedRecipes array with the new id from the saved recipe
                recipe.id = savedRecipe._id.toString();
        
                return recipe;
            })
        );

        return res.status(200).json({ results: enrichedRecipes, totalResults: recipesData.totalResults });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller: Search Recipes by Ingredients
export const searchRecipesByIngredients = async (req, res) => {
    try {
        await decodeFirebaseIdToken(req.headers.authorization);
        const {  number = 10 ,fields = "", ...params} = req.query;
        const fieldsArray = fields ? fields.split(',').map(field => field.trim()) : [];

        const recipesData = await spoonacularRequest('/recipes/findByIngredients', { number, ...params });
        const enrichedRecipes = await enrichRecipesWithFields(recipesData, fieldsArray);

        return  res.status(200).json({ results: enrichedRecipes, totalResults: recipesData.totalResults });

    } catch (error) {
        return  res.status(500).json({ error: error.message });
    }
};


// Controller: Search Recipes by Nutrients
export const searchRecipesByNutrients = async (req, res) => {
    try {
        const {  number = 10 ,fields = "", ...params} = req.query;
        
        const fieldsArray = fields ? fields.split(',').map(field => field.trim()) : [];

        const recipesData = await spoonacularRequest('/recipes/findByNutrients', { number, ...params });
        const enrichedRecipes = await enrichRecipesWithFields(recipesData, fieldsArray);

        return  res.status(200).json({ results: enrichedRecipes, totalResults: recipesData.totalResults });

    } catch (error) {
        return  res.status(500).json({ error: error.message });
    }
};

// Controller: Get Recipe Information
export const getRecipeInformation = (req, res) => {
    const id = req.params.id.toString();
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid recipe' });
    }

    getRecipeInfoById(id)
        .then(data => {
            if (!data) {
                return res.status(404).json({ error: "Recipe not found." });
            }

            decodeFirebaseIdToken(req.headers.authorization)
                .then(({ uid }) => {
                    updateUserSearchHistory(uid, id)
                        .then(() => {
                            return res.status(200).json(data);
                        })
                        .catch(error => {
                            return res.status(500).json({ error: error.message });
                        });
                })
                .catch(error => {
                    return res.status(500).json({ error: error.message });
                });
        })
        .catch(error => {
            return res.status(500).json({ error: error.message });
        });
};

// Controller: Get Recipe Summary
export const getRecipeSummary = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getRecipeInfoById(id, "_id title summary");
        
        const plainTextSummary= stripHtml(data.summary).result;
        return res.status(200).json(
            {
                id: data.id,
                title: data.title,
                summary: plainTextSummary // Send plain text instead of HTML
            }
        );
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller: Get Similar Recipes
export const getSimilarRecipes = async (req, res) => {
    try {
        let { id } = req.params;
        const { number = 5,fields="" } = req.query;
        const fieldsArray = fields ? fields.split(',').map(field => field.trim()) : [];

        id = Number(id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "Invalid recipe ID." });
        }
        
        const recipesData = await spoonacularRequest(`/recipes/${id}/similar`, { number });
        const enrichedRecipes = await enrichRecipesWithFields(recipesData, fieldsArray);

        return  res.status(200).json({ results: enrichedRecipes });

    } catch (error) {
        return  res.status(500).json({ error: error.message });
    }
};

// 🔍 Autocomplete Recipes
export const autoCompleteRecipes = async (req, res) => {
    try {
        const { query, number = 5 } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Query parameter is required." });
        }

        const data = await spoonacularRequest('/recipes/autocomplete', { query, number });

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// 🍏 Autocomplete Ingredients
export const autoCompleteIngredients = async (req, res) => {
    try {
        const { query, number = 5 } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Query parameter is required." });
        }

        // Request Spoonacular API
        const data = await spoonacularRequest('/food/ingredients/autocomplete', { query, number });

        return  res.status(200).json(data);
    } catch (error) {
        return  res.status(500).json({ error: error.message });
    }
};

export const getSearchesFromHistory = (req, res) => {
    let { n } = req.params;
    n = Number(n.toString());
    if (!Number.isInteger(n) || n <= 0) {
        return res.status(400).json({ error: "Invalid history query." });
    }

    decodeFirebaseIdToken(req.headers.authorization)
        .then(({ uid }) => {
            return getSearchHistoryByUid(uid);
        })
        .then(searchHistory => {
            if (!searchHistory || searchHistory.history.length === 0) {
                return res.status(200).json({ results: [] });
            }

            // Extract n unique recent history and fetch recipe details
            return getUniqueRecentHistoryWithRecipeInfo(searchHistory.history, n)
                .then(responseHistory => {
                    return res.status(200).json({ results: responseHistory });
                });
        })
        .catch(error => {
            return res.status(500).json({ error: error.message });
        });
};

/**
 * Fetches additional fields for each recipe dynamically.
 * @param {Array} recipes - List of recipe objects with IDs.
 * @param {Array} fields - List of fields to fetch (e.g., ["summary", "nutrition", "likes"]).
 * @returns {Array} - Recipes enriched with the requested fields.
 */
const enrichRecipesWithFields = async (recipes, fields = []) => {

    if (!recipes || recipes.length === 0 || fields.length === 0) return recipes;

    // Define which endpoint to use for each requested field
    const fieldEndpoints = {
        summary: (id) => `/recipes/${id}/summary`,
        likes: (id) => `/recipes/${id}/information`, // Likes come from "aggregateLikes" in this response
    };

    try {
        // Fetch all requested fields for each recipe
        const detailsFetchers = recipes.map(async (recipe) => {

            let enrichedRecipe = { ...recipe };

            for (const field of fields) {
                if (!fieldEndpoints[field]) continue; // Skip if field is not recognized

                try {
                    const fieldData = await spoonacularRequest(fieldEndpoints[field](recipe.id));

                    // Process data differently based on field type
                    if (field === "summary") {
                        enrichedRecipe.summary = stripHtml(fieldData.summary).result || "No summary available";
                    } else if (field === "likes") {
                        enrichedRecipe.likes = fieldData.aggregateLikes || 0;
                    } 
                } catch (error) {
                    console.error("Error fetching %s for recipe %s: %s", field, recipe?.id, error.message);
                }
            }

            return enrichedRecipe;
        });

        // Resolve all fetchers in parallel
        return await Promise.all(detailsFetchers);

    } catch (error) {
        console.error("Error enriching recipes with additional fields:", error);
        return recipes.map(recipe => ({ ...recipe, error: "Failed to fetch additional details" }));
    }
};

const getUniqueRecentHistoryWithRecipeInfo = (history, n) => {
    const uniqueHistoryMap = new Map();

    // Iterate from the end of the history (most recent first)
    for (let i = history.length - 1; i >= 0; i--) {
        const { recipeId, searchedAt } = history[i];
        // If the recipeId is not in the map, add it with the current search timestamp
        if (!uniqueHistoryMap.has(recipeId)) {
            uniqueHistoryMap.set(recipeId, { recipeId, searchedAt });
        } else {
            // If the recipeId already exists, update it only if the current search is more recent
            const currentSearch = uniqueHistoryMap.get(recipeId);
            if (new Date(searchedAt) > new Date(currentSearch.searchedAt)) {
                uniqueHistoryMap.set(recipeId, { recipeId, searchedAt });
            }
        }
    }

    // Get the n most recent unique searches
    const recentUniqueSearches = Array.from(uniqueHistoryMap.values())
        .slice(0, n)
        .sort((a, b) => new Date(b.searchedAt) - new Date(a.searchedAt));

    // Retrieve recipe details for the selected recipeIds
    const recipeIds = recentUniqueSearches.map(entry => entry.recipeId);
    return findRecipesByIds(recipeIds).then(recipes => {
        const recipeMap = new Map(recipes.map(recipe => [recipe.id, recipe]));
        
        // Return the final history with recipe details included
        return recentUniqueSearches.map(({ recipeId, searchedAt }) => ({
            searchedAt,
            ...(recipeMap.get(recipeId) || { id: recipeId, title: null, image: null, likes: 0 })
        }));
    });
};

const updateUserSearchHistory = (uid, recipeId) => {
    return getSearchHistoryByUid(uid)
        .then(searchHistory => {
            if (searchHistory && searchHistory.history) {
                searchHistory.history.unshift({
                    recipeId: recipeId,
                    searchedAt: Date.now()
                });
                searchHistory.save();
            } else {
                createUserEntryInUserSearchHistory(uid, recipeId);
            }
        })
        .catch(() => {
            throw new Error("Failed to update search history");
        });
}
