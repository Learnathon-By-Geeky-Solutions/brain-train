import { spoonacularRequest } from './spoonacularService.js';
import { enrichRecipesWithFields } from './fetchExtraFields.js';
import { stripHtml } from 'string-strip-html'; 





export const searchRecipes = async (req, res) => {
    try {
        const { number = 10, fields = "" , ...params } = req.query;
        console.log("Query Params:", params);

        // Convert "fields" query string into an array (e.g., "summary,likes,nutrition")
        const fieldsArray = fields ? fields.split(',').map(field => field.trim()) : [];

        // Fetch recipes
        const recipesData = await spoonacularRequest('/recipes/complexSearch', { number, ...params });

        // Enrich recipes with requested fields
        const enrichedRecipes = await enrichRecipesWithFields(recipesData.results, fieldsArray);

        res.status(200).json({ results: enrichedRecipes, totalResults: recipesData.totalResults });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





// Controller: Search Recipes by Ingredients
export const searchRecipesByIngredients = async (req, res) => {
    try {
        const {  number = 10 ,fields = "", ...params} = req.query;
        console.log("ingredients", params.ingredients);
        const fieldsArray = fields ? fields.split(',').map(field => field.trim()) : [];

        const recipesData = await spoonacularRequest('/recipes/findByIngredients', { number, ...params });
        const enrichedRecipes = await enrichRecipesWithFields(recipesData, fieldsArray);

        res.status(200).json({ results: enrichedRecipes, totalResults: recipesData.totalResults });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Controller: Search Recipes by Ingredients
export const searchRecipesByNutrients = async (req, res) => {
    try {
        const {  number = 10 ,fields = "", ...params} = req.query;
        
        const fieldsArray = fields ? fields.split(',').map(field => field.trim()) : [];

        const recipesData = await spoonacularRequest('/recipes/findByNutrients', { number, ...params });
        const enrichedRecipes = await enrichRecipesWithFields(recipesData, fieldsArray);

        res.status(200).json({ results: enrichedRecipes, totalResults: recipesData.totalResults });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller: Get Recipe Information
export const getRecipeInformation = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id", id);
        const data = await spoonacularRequest(`/recipes/${id}/information`);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller: Get Recipe Summary
export const getRecipeSummary = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id", id);
        const data = await spoonacularRequest(`/recipes/${id}/summary`);
        
        const plainTextSummary= stripHtml(data.summary).result;//strip html tags from summary
        res.status(200).json(
            {
                id: data.id,
                title: data.title,
                summary: plainTextSummary // Send plain text instead of HTML
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        console.log("🔍 Autocomplete Ingredient Query:", query);

        // Request Spoonacular API
        const data = await spoonacularRequest('/food/ingredients/autocomplete', { query, number });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};