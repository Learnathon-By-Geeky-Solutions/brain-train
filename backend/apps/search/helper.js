import { spoonacularRequest } from '../../libraries/services/spoonacular.js';
import { stripHtml } from 'string-strip-html'; 


/**
 * Fetches additional fields for each recipe dynamically.
 * @param {Array} recipes - List of recipe objects with IDs.
 * @param {Array} fields - List of fields to fetch (e.g., ["summary", "nutrition", "likes"]).
 * @returns {Array} - Recipes enriched with the requested fields.
 */
export const enrichRecipesWithFields = async (recipes, fields = []) => {

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
                    console.error(`Error fetching ${field} for recipe ${recipe.id}:`, error);
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


/**
 * Fetch detailed information for multiple recipes using Spoonacular's /recipes/informationBulk.
 * @param {Array} recipeIds - List of recipe IDs.
 * @returns {Array} - Full recipe details including nutrition, cuisine, diets, etc.
 */
export const fetchRecipeDetailsBulk = async (recipeIds) => {
    if (!recipeIds || recipeIds.length === 0) return [];

    try {
        const recipeIdsString = recipeIds.join(",");
        const fullRecipes = await spoonacularRequest("/recipes/informationBulk", {
            ids: recipeIdsString,
            includeNutrition: true
        });

        return fullRecipes;
    } catch (error) {
        console.error("Error fetching recipe details:", error);
        return [];
    }
};

