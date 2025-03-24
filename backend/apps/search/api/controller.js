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
import { enrichRecipesWithFields,fetchRecipeDetailsBulk,filterRecipes,generateShoppingList,fetchSaveFilterRecipes } from '../helper.js';

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
        const { query,...filters } = params;

        // Convert "fields" query string into an array (e.g., "summary,likes,nutrition")
        const fieldsArray = fields ? fields.split(',').map(field => field.trim()) : [];
    
        
        // Query db with params, fields and limit
        let dbResults = await  getRecipeFieldsByTitle(query, fieldsArray, number);
        console.log("🔍 DB Results Before Filtering:", dbResults.length);

        //  Apply Filters to DB Results
        dbResults = filterRecipes(dbResults, filters);

        console.log(" DB Results After Filtering:", dbResults.length);
        if (dbResults.length > 0) {
            return res.status(200).json({ results: dbResults, totalResults: dbResults.length });
        }

        // Fetch recipes
        console.log(" Fetching from Spoonacular API...", params);
        const apiResults = await spoonacularRequest('/recipes/complexSearch', {number, ...params });

        


        if (!apiResults.results || apiResults.results.length === 0) {
            console.log(" No results found in Spoonacular API either.");
            return res.status(404).json({ results: [], totalResults: 0 });
        }

        

        //  Fetch additional fields in bulk using Spoonacular API
        const recipeIds = apiResults.results.map(recipe => recipe.id);


        const filteredApiResults = await fetchSaveFilterRecipes(recipeIds, filters);

        return res.status(200).json({ results: filteredApiResults, totalResults: filteredApiResults.length });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Controller: Search Recipes by Ingredients
export const searchRecipesByIngredients = async (req, res) => {
    try {
        await decodeFirebaseIdToken(req.headers.authorization);
        
        //  Extract required and optional parameters
        const { number = 20, ingredients, fields = "", ...filters } = req.query;
        
        if (!ingredients) {
            return res.status(400).json({ error: "'ingredients' parameter is required." });
        }

        const fieldsArray = fields ? fields.split(',').map(field => field.trim()) : [];


        //  Fetch recipes from DB
        let dbResults = await getRecipesByIngredients(ingredients, fieldsArray, number, filters);

        console.log("🔍 DB Results Before Filtering:", dbResults.length);

        //  Apply Filters to DB Results
        dbResults = filterRecipes(dbResults, filters);

        console.log(" DB Results After Filtering:", dbResults.length);

        if (dbResults.length > 0) {
            return res.status(200).json({ results: dbResults, totalResults: dbResults.length });
        }

        //  No results from DB? Fetch from Spoonacular API
        console.log(" Fetching from Spoonacular API...");
        const apiResults = await spoonacularRequest('/recipes/findByIngredients', { number, ingredients });

        if (!apiResults || apiResults.length === 0) {
            console.log(" No results found in Spoonacular API either.");
            return res.status(404).json({ results: [], totalResults: 0 });
        }

        console.log(" API Results Before Enrichment:", apiResults.length);

        //  Fetch additional fields in bulk using Spoonacular API
        const recipeIds = apiResults.map(recipe => recipe.id);

        const filteredApiResults = await fetchSaveFilterRecipes(recipeIds, filters);

        return res.status(200).json({ results: filteredApiResults, totalResults: filteredApiResults.length });

    } catch (error) {
        console.error(" Error in searchRecipesByIngredients:", error);
        return res.status(500).json({ error: error.message });
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
        const { number = 10} = req.query;

        const data=await getRecipeInfoById(id,"_id sourceId");
        
        const recipesData = await spoonacularRequest(`/recipes/${data.sourceId}/similar`, { number });
        // const enrichedRecipes = await enrichRecipesWithFields(recipesData, fieldsArray);
                //  Fetch additional fields in bulk using Spoonacular API
        const recipeIds = recipesData.map(recipe => recipe.id);

        const completeApiResults = await fetchSaveFilterRecipes(recipeIds, {});
        

            // Return only selected fields
        const filteredFields = completeApiResults.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            summary: recipe.summary,
            likes: recipe.likes
        }));
    
        return res.status(200).json({
            results: filteredFields,
            totalResults: filteredFields.length
        });

        

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

    // Iterate from the beginning (most recent first due to unshift)
    for (const { recipeId, searchedAt } of history) {
        if (!uniqueHistoryMap.has(recipeId)) {
            uniqueHistoryMap.set(recipeId, { recipeId, searchedAt });
        }
    }

    // Get the n most recent unique searches
    const recentUniqueSearches = Array.from(uniqueHistoryMap.values()).slice(0, n);

    // Retrieve recipe details for the selected recipeIds
    const recipeIds = recentUniqueSearches.map(entry => entry.recipeId);
    return findRecipesByIds(recipeIds).then(recipes => {
        const recipeMap = new Map(recipes.map(recipe => [recipe.id, recipe]));
        
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
