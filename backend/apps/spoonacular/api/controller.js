import { spoonacularRequest } from './spoonacularService.js';

// Controller: Search Recipes by Query
export const searchRecipes = async (req, res) => {
    try {
        const { query, cuisine, diet, number = 10 } = req.query;
        console.log("query", query);
        const data = await spoonacularRequest('/recipes/complexSearch', { query, cuisine, diet, number });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller: Search Recipes by Ingredients
export const searchRecipesByIngredients = async (req, res) => {
    try {
        const { ingredients, number = 10 } = req.query;
        console.log("ingredients", ingredients);
        const data = await spoonacularRequest('/recipes/findByIngredients', { ingredients, number });
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
