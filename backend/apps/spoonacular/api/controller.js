import { spoonacularRequest } from './spoonacularService.js';
import { stripHtml } from 'string-strip-html'; 

// Controller: Search Recipes by Query
export const searchRecipes = async (req, res) => {
    try {
        const {  number = 10 , ...params} = req.query;
        // console.log("Raw req.query:", req.query); // Debugging step
        // console.log("Params Object:", params);
        // console.log("Diet Field from params:", params.diet || "No diet parameter provided");

        const data = await spoonacularRequest('/recipes/complexSearch', {  number , ...params });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller: Search Recipes by Ingredients
export const searchRecipesByIngredients = async (req, res) => {
    try {
        const {  number = 10 , ...params} = req.query;
        console.log("ingredients", params.ingredients);
        const data = await spoonacularRequest('/recipes/findByIngredients', { number, ...params });
        res.status(200).json(data);
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