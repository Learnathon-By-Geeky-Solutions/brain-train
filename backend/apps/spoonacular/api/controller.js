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
        // console.log("data", data);
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