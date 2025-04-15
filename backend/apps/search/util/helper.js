import { spoonacularRequest } from '../../../libraries/services/spoonacular.js';
import{ saveRecipeDetails,getRecipeBySourceId, getRecipeInfoById } from '../db.js';





/**
 * Fetch detailed information for multiple recipes using Spoonacular's /recipes/informationBulk.
 * @param {Array<string>} recipeIds - List of recipe IDs.
 * @returns {Promise<Array<Object>>} - Full recipe details including nutrition, cuisine, diets, etc.
 */
export const fetchRecipeDetailsBulk = (recipeIds) => {
  if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
    return Promise.resolve([]);
  }

  const recipeIdsString = recipeIds.join(",");
  console.log("Fetching full recipes for IDs:", recipeIdsString);

  return spoonacularRequest("/recipes/informationBulk", {
    ids: recipeIdsString,
    includeNutrition: true
  })
    .then((fullRecipes) => {
      console.log("Fetched full recipes:", fullRecipes.length);
      return fullRecipes;
    })
    .catch((error) => {
      console.error("Error fetching recipe details:", error);
      return [];
    });
};


    // ✅ Convert string booleans to actual booleans
    const convertToBoolean = (value) => {
        if (typeof value === "boolean") return value;  // Already a boolean
        console.debug("Value:", value);
        if (typeof value === "string") return value.toLowerCase() === "true";  // Convert "true"/"false" to boolean
        return null;  // Keep FALSE if field not provided
    };


export const filterRecipes = async (recipes, filters) => {
    if (!recipes || recipes.length === 0) {
        console.debug("No recipes provided or empty list.");
        return [];
    }

    console.debug("Filters provided:", filters);

    const {
        minCarbs, maxCarbs, minProtein, maxProtein,
        minFat, maxFat, minCalories, maxCalories,
        diet, cuisine,
        vegetarian, vegan, glutenFree, dairyFree
    } = filters;

    // Check if all optional fields are empty
    const allFieldsEmpty = !minCarbs && !maxCarbs && !minProtein && !maxProtein &&
        !minFat && !maxFat && !minCalories && !maxCalories &&
        !diet && !cuisine  &&
        !vegetarian && !vegan && !glutenFree && !dairyFree;

    if (allFieldsEmpty) {
        console.debug("All optional fields are empty. Returning original recipes list.");
        return recipes;
    }

    const cuisineList = cuisine ? cuisine.split(",").map(c => c.trim().toLowerCase()) : [];
    const dietList = diet ? diet.split(",").map(d => d.trim().toLowerCase()) : [];

    console.debug("Cuisine list:", cuisineList);
    console.debug("Diet list:", dietList);

    const results = [];


    // return recipes.filter(r => {
    for (const r of recipes) {    
        console.debug("Processing recipe:", r._id);
        const recipe= await ensureFullRecipe(r);

        const nutrients = recipe.nutrition?.nutrients || [];



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
        console.log("recipes cuisines",recipe.cuisines);


        const meetsCuisineCriteria =
          cuisineList.length === 0 ||
          (recipe.cuisines && cuisineList.some(c => recipe.cuisines.map(rc => rc.toLowerCase()).includes(c)));


        console.debug("Meets cuisine criteria:", meetsCuisineCriteria);


        
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

        const result = meetsNutrientCriteria && meetsDietCriteria && meetsCuisineCriteria  && meetsBooleanCriteria;
        console.debug("Final decision for recipe", recipe._id, ":", result);

        // return result;
        if (result) results.push(recipe);
    }
    const allRecipes = results.map(recipe => ({
      ...recipe,
      id: recipe._id?.toString() || recipe.id // Ensure `id` is set
  }));
    return allRecipes;
};





/**
 * Ensure the recipe object includes all fields needed by filterRecipes.
 * If fields are missing, fetch the full recipe from the database.
 *
 * @param {Object} recipe - Partial or full recipe object
 * @returns {Object} - Complete recipe object
 */
export const ensureFullRecipe = async (recipe) => {
  // Check if all required fields exist (regardless of being empty or null)
  const hasAllRequiredFields =
    "nutrition" in recipe &&
    "cuisines" in recipe &&
    "vegetarian" in recipe &&
    "vegan" in recipe &&
    "glutenFree" in recipe &&
    "dairyFree" in recipe;

  if (hasAllRequiredFields) {
    console.log("Recipe already has all required fields.");
    return recipe; // Already good to go
  }
  console.log("Recipe is missing some required fields. Fetching full details...");

  // Try to load by MongoDB _id or fallback id
  if (recipe._id || recipe.id) {
    const full = await getRecipeInfoById(recipe._id || recipe.id);
    if (full) return full;
  }

  // Fallback to lookup by sourceId (e.g., Spoonacular ID)
  if (recipe.sourceId) {
    const matches = await getRecipeBySourceId([recipe.sourceId]);
    if (matches.length > 0) return matches[0];
  }

  console.warn(" Could not find full recipe in DB for:", recipe._id || recipe.sourceId || recipe.id);
  return recipe; // Return partial recipe as a last resort
};


  

  /**
 * Fetch recipes by IDs from Spoonacular, enrich them if missing, save to DB, and return all filtered.
 * @param {Array} recipeIds - Array of recipe IDs from Spoonacular,this is SourceId/SpoonacularId
 * @param {Object} filters - Optional filters to apply
 * @returns {Array} - Filtered enriched recipes (existing + new)
 */
export const fetchSaveFilterRecipes = async (recipeIds, filters = {}) => {
    // 1. Get existing recipes from DB by sourceId
    const existingRecipes = await getRecipeBySourceId(recipeIds);
    const existingIdsSet = new Set(existingRecipes.map(r => String(r.sourceId)));
    console.log("Existing Recipe Count:", existingRecipes.length);
    console.log("Existing Recipe Count:", existingIdsSet);
    console.log("Existing Recipe :", existingRecipes);
  
    // 2. Get only the missing recipe IDs
    const missingIds = recipeIds.filter(id => !existingIdsSet.has(String(id)));
    console.log("Missing Recipe Count:", missingIds.length);
    console.log("Missing Recipe Count:", missingIds);
  
    let newRecipes = [];
  
    // 3. If any missing, fetch from API and save to DB
    if (missingIds.length > 0) {
      try {
        const detailedRecipes = await fetchRecipeDetailsBulk(missingIds);
        console.log("📊 New Recipe Count:", detailedRecipes.length);
  
        const enrichedRecipes=await Promise.all(
          detailedRecipes.map(async (recipe) => {
            const savedRecipe = await saveRecipeDetails(recipe);
            recipe.id = savedRecipe._id.toString();
            recipe.likes = savedRecipe.likes;
            recipe.image = savedRecipe.image;
            console.log("saved recipe sourceId",savedRecipe.sourceId);
            console.log("saved recipe id",savedRecipe._id);
            // return recipe;
            return {
              ...savedRecipe,
              id: savedRecipe._id.toString(),          // for frontend use
              sourceId: savedRecipe.sourceId.toString()   // ensure type safety
            };
          })
        );
  
        newRecipes = enrichedRecipes;
      } catch (err) {
        console.error("❌ Error fetching/saving recipes:", err);
      }
    }
  
    // 4. Combine new + existing recipes
    const allRecipes = [...existingRecipes, ...newRecipes].map(recipe => ({
        ...recipe,
        id: recipe._id?.toString() || recipe.id // Ensure `id` is set
    }));
    
  
    // 5. Filter and return
    const filtered =await filterRecipes(allRecipes, filters);
    
    console.log("all recipes count",allRecipes.length);
    console.log("✅ Filtered Results:", filtered.length);
  
    return filtered;
  };

  /**
   * Normalize recipe `_id` to `id` for frontend compatibility.
   * @param {Object} recipe - Recipe object from DB.
   * @returns {Object} - Normalized recipe object.
   */
  const normalizeRecipeId = (recipe) => ({
    ...recipe,
    id: recipe._id?.toString() || recipe.id
  });

  export const minimizeRecipeData = (recipes) => {
    return recipes.map(recipe => ({
      _id: recipe._id || recipe.id,
      id: recipe._id || recipe.id,
      title: recipe.title,
      image: recipe.image,
      summary: recipe.summary,
      likes: recipe.likes
    }));
  };
  