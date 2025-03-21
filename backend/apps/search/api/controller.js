import { spoonacularRequest } from '../../../libraries/services/spoonacular.js';
import { stripHtml } from 'string-strip-html'; 
import { 
    getRecipeFieldsByParams,
    saveRecipeDetails,
    getRecipeInfoById,
    getRecipesByIngredients
} from '../db.js';
import { decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';
import { enrichRecipesWithFields,fetchRecipeDetailsBulk,filterRecipes } from '../helper.js';


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
                const details = await spoonacularRequest(`/recipes/${recipe.id}/information?includeNutrition=true`);
                console.log('checking nutrition details',details);
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
        
        //  Extract required and optional parameters
        const { number = 20, ingredients, fields = "", ...filters } = req.query;
        
        if (!ingredients) {
            return res.status(400).json({ error: "'ingredients' parameter is required." });
        }

        console.log("🛠️ Required Ingredients:", ingredients);
        console.log("🛠️ Optional Filters:", filters);

        //  Fetch recipes from DB
        let dbResults = await getRecipesByIngredients(ingredients, [], number, filters);

        console.log("🔍 DB Results Before Filtering:", dbResults.length);

        //  Apply Filters to DB Results
        dbResults = filterRecipes(dbResults, filters);

        console.log(" DB Results After Filtering:", dbResults.length);

        if (dbResults.length > 0) {
            return res.status(200).json({ results: dbResults, totalResults: dbResults.length });
        }

        // ✅ No results from DB? Fetch from Spoonacular API
        console.log("🔄 Fetching from Spoonacular API...");
        const apiResults = await spoonacularRequest('/recipes/findByIngredients', { number, ingredients });

        if (!apiResults || apiResults.length === 0) {
            console.log("❌ No results found in Spoonacular API either.");
            return res.status(404).json({ results: [], totalResults: 0 });
        }

        console.log("🌍 API Results Before Enrichment:", apiResults.length);

        // ✅ Fetch additional fields in bulk using Spoonacular API
        const recipeIds = apiResults.map(recipe => recipe.id);
        const detailedRecipes = await fetchRecipeDetailsBulk(recipeIds);

        console.log("📊 API Recipes with Details:", detailedRecipes.length);

        // ✅ Apply Filters to API Fetched Recipes
        const filteredApiResults = filterRecipes(detailedRecipes, filters);

        console.log("✅ API Results After Filtering:", filteredApiResults.length);

        // ✅ Save API results to DB for future use
        await Promise.all(
            filteredApiResults.map(async (recipe) => {
                const savedRecipe = await saveRecipeDetails(recipe);
                recipe.id = savedRecipe._id.toString();
                return recipe;
            })
        );

        return res.status(200).json({ results: filteredApiResults, totalResults: filteredApiResults.length });

    } catch (error) {
        console.error("❌ Error in searchRecipesByIngredients:", error);
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
export const getRecipeInformation = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("information", id);
        const data = await getRecipeInfoById(id);

        if (!data) {
            console.log("Recipe not found");
            return res.status(404).json({ error: "Recipe not found." });
        }
        // console.log("data", data);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
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
        const { id } = req.params;
        const { number = 5,fields="" } = req.query;
        const fieldsArray = fields ? fields.split(',').map(field => field.trim()) : [];

        
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

