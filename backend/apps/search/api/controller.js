import { spoonacularRequest } from '../../../libraries/services/spoonacular.js';
import { stripHtml } from 'string-strip-html'; 
import {
    getRecipeInfoById,
    getSearchHistoryByUid,
    createUserEntryInUserSearchHistory,
    getRecipeFieldsByTitle,
    getRecipesByIngredients
} from '../db.js';
import { findRecipesByIds } from '../../favourite/db.js';
import { decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';
import { 
    enrichRecipesWithFields,
    filterRecipes,
    fetchSaveFilterRecipes,
    generateShoppingList,
    minimizeRecipeData
} from '../helper.js';

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
        
        console.log("🔍 DB Results length Before Filtering:", dbResults.length);

        //  Apply Filters to DB Results
        dbResults =await filterRecipes(dbResults, filters);


        console.log(" DB Results After Filtering:", dbResults.length);
        if (dbResults.length > 0) {
            return res.status(200).json({ results: minimizeRecipeData(dbResults), totalResults: dbResults.length });
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

        return res.status(200).json({ results: minimizeRecipeData( filteredApiResults), totalResults: filteredApiResults.length });
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
        dbResults =await filterRecipes(dbResults, filters);

        console.log(" DB Results After Filtering:", dbResults.length);

        if (dbResults.length > 0) {
            return res.status(200).json({ results: minimizeRecipeData(dbResults), totalResults: dbResults.length });
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

        return res.status(200).json({ results: minimizeRecipeData( filteredApiResults), totalResults: filteredApiResults.length });

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

        return  res.status(200).json({ results: minimizeRecipeData(enrichedRecipes), totalResults: recipesData.totalResults });

    } catch (error) {
        return  res.status(500).json({ error: error.message });
    }
};

// Controller: Get Recipe Information
export const getRecipeInformation = (req, res) => {

    const id = req.params.id.toString();
    console.log("Information",id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("Invalid Recipe id");
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
                // Step 1: Search from DB with regex (LIKE 'query%')
                const dbResults = await getRecipeFieldsByTitle(query, ['_id','title'], number, true); // true = regex autocomplete mode
                let suggestions = dbResults.map(recipe => ({
                    id: recipe.id,
                    title: recipe.title
                }));
                console.log("🔍 DB Suggestions:", suggestions);
                // Step 2: If enough suggestions, return
                if (suggestions.length >= number) {
                    return res.status(200).json(suggestions.slice(0, number));
                }

                const apiData = await spoonacularRequest('/recipes/autocomplete', { query, number });
                const apiIds = apiData.map(recipe => recipe.id);
                console.log("api ids",apiIds);
                const seenTitles = new Set(suggestions.map(s => s.title.toLowerCase()));
                const newApiRecipes = apiData.filter(recipe => !seenTitles.has(recipe.title.toLowerCase()));

      
            
        
                const savedApiResults = await fetchSaveFilterRecipes(apiIds, {});
                console.log("api results saved",savedApiResults.length);

                suggestions = suggestions.concat(newApiRecipes).slice(0, number);
            

                return res.status(200).json(suggestions);
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

export const getShoppingList = async (req, res) => {
    try {
        const { id } = req.params;
        const { requestedServing } = req.query;

        if (!requestedServing || isNaN(requestedServing)) {
        return res.status(400).json({ error: "Missing or invalid 'requestedServing' parameter." });
    }

        const data = await getRecipeInfoById(id);

        if (!data) {
        console.log("Recipe not found");
        return res.status(404).json({ error: "Recipe not found." });
    }

        const shoppingList = generateShoppingList(data, Number(requestedServing) );
        return res.status(200).json({ recipeId: id, servings: requestedServing, shoppingList });

    } catch (error) {
        console.error("Error generating shopping list:", error);
        return res.status(500).json({ error: error.message });
    }
};

