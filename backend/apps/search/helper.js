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
        console.log("Fetched full recipes:", fullRecipes.length);

        return fullRecipes;
    } catch (error) {
        console.error("Error fetching recipe details:", error);
        return [];
    }
};

    // ✅ Convert string booleans to actual booleans
    const convertToBoolean = (value) => {
        if (typeof value === "boolean") return value;  // Already a boolean
        console.debug("Value:", value);
        if (typeof value === "string") return value.toLowerCase() === "true";  // Convert "true"/"false" to boolean
        return null;  // Keep FALSE if field not provided
    };


export const filterRecipes = (recipes, filters) => {
    if (!recipes || recipes.length === 0) {
        console.debug("No recipes provided or empty list.");
        return [];
    }

    console.debug("Filters provided:", filters);

    const {
        minCarbs, maxCarbs, minProtein, maxProtein,
        minFat, maxFat, minCalories, maxCalories,
        diet, cuisine, intolerances,
        vegetarian, vegan, glutenFree, dairyFree
    } = filters;

    // Check if all optional fields are empty
    const allFieldsEmpty = !minCarbs && !maxCarbs && !minProtein && !maxProtein &&
        !minFat && !maxFat && !minCalories && !maxCalories &&
        !diet && !cuisine && !intolerances &&
        !vegetarian && !vegan && !glutenFree && !dairyFree;

    if (allFieldsEmpty) {
        console.debug("All optional fields are empty. Returning original recipes list.");
        return recipes;
    }

    const cuisineList = cuisine ? cuisine.split(",").map(c => c.trim().toLowerCase()) : [];
    const dietList = diet ? diet.split(",").map(d => d.trim().toLowerCase()) : [];
    const intoleranceList = intolerances ? intolerances.split(",").map(i => i.trim().toLowerCase()) : [];

    console.debug("Cuisine list:", cuisineList);
    console.debug("Diet list:", dietList);
    console.debug("Intolerance list:", intoleranceList);

    return recipes.filter(recipe => {
        console.debug("Processing recipe:", recipe.id);

        const nutrients = recipe.nutrition?.nutrients || [];

        console.debug("Nutrients Data:", JSON.stringify(recipe.nutrition?.nutrients, null, 2));


        const calories = nutrients.find(n => typeof n.name === "string" && n.name.toLowerCase() === "calories")?.amount || 0;
        const carbs = nutrients.find(n => typeof n.name === "string" && n.name.toLowerCase() === "carbohydrates")?.amount || 0;
        const protein = nutrients.find(n => typeof n.name === "string" && n.name.toLowerCase() === "protein")?.amount || 0;
        const fat = nutrients.find(n => typeof n.name === "string" && n.name.toLowerCase() === "fat")?.amount || 0;
        
        console.debug("Nutrients - Calories:", calories, "Carbs:", carbs, "Protein:", protein, "Fat:", fat);
        
 

        const isVegetarian = convertToBoolean(recipe.vegetarian);
        const isVegan = convertToBoolean(recipe.vegan);
        const isGlutenFree = convertToBoolean(recipe.glutenFree);
        const isDairyFree = convertToBoolean(recipe.dairyFree);



        console.debug("Boolean fields - Vegetarian:", isVegetarian, "Vegan:", isVegan, "GlutenFree:", isGlutenFree, "DairyFree:", isDairyFree);

        const meetsNutrientCriteria =
            (!minCalories || calories >= minCalories) &&
            (!maxCalories || calories <= maxCalories) &&
            (!minCarbs || carbs >= minCarbs) &&
            (!maxCarbs || carbs <= maxCarbs) &&
            (!minProtein || protein >= minProtein) &&
            (!maxProtein || protein <= maxProtein) &&
            (!minFat || fat >= minFat) &&
            (!maxFat || fat <= maxFat);

        console.debug("Meets nutrient criteria:", meetsNutrientCriteria);

        const meetsDietCriteria =
            dietList.length === 0 || (recipe.diets && recipe.diets.some(d => dietList.includes(d.toLowerCase())));

        console.debug("Meets diet criteria:", meetsDietCriteria);

        const meetsCuisineCriteria =
            cuisineList.length === 0 ||
            (recipe.cuisines && recipe.cuisines.some(c => cuisineList.includes(c.toLowerCase())));

        console.debug("Meets cuisine criteria:", meetsCuisineCriteria);

        const meetsIntoleranceCriteria =
            intoleranceList.length === 0 ||
            !recipe.extendedIngredients?.some(ingredient =>
                intoleranceList.includes(ingredient.name?.toLowerCase() || "")
            );

        console.debug("Meets intolerance criteria:", meetsIntoleranceCriteria);
        
        const vegetarianExpected = convertToBoolean(vegetarian);
        const veganExpected = convertToBoolean(vegan);
        const glutenFreeExpected = convertToBoolean(glutenFree);
        const dairyFreeExpected = convertToBoolean(dairyFree);

        const meetsBooleanCriteria =
            (vegetarianExpected === null || isVegetarian === vegetarianExpected) &&
            (veganExpected === null || isVegan === veganExpected) &&
            (glutenFreeExpected === null || isGlutenFree === glutenFreeExpected) &&
            (dairyFreeExpected === null || isDairyFree === dairyFreeExpected);

        console.debug("Meets boolean criteria:", meetsBooleanCriteria);

        const result = meetsNutrientCriteria && meetsDietCriteria && meetsCuisineCriteria && meetsIntoleranceCriteria && meetsBooleanCriteria;
        console.debug("Final decision for recipe", recipe.id, ":", result);

        return result;
    });
};





