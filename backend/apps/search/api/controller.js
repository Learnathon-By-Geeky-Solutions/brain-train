import { spoonacularRequest } from '../../../libraries/services/spoonacular.js';
import { stripHtml } from 'string-strip-html'; 
import { 
    getRecipeFieldsByTitle,
    getRecipeInfoById,
    getRecipesByIngredients
} from '../db.js';
import { decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';
import { enrichRecipesWithFields,fetchRecipeDetailsBulk,filterRecipes,generateShoppingList,fetchSaveFilterRecipes } from '../helper.js';


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
export const getRecipeInformation = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("information", id);
        const data = await getRecipeInfoById(id);

        if (!data) {
            console.log("Recipe not found");
            return res.status(404).json({ error: "Recipe not found." });
        }
        
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