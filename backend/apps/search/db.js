import Recipe from "../../libraries/models/recipes.js";

export const getRecipeFieldsByParams = async (conditions, fields, number) => {
  if (conditions.query) {
    conditions.title = { $regex: conditions.query, $options: "i" }; // Case-insensitive search
    delete conditions.query; // Remove the 'query' key from conditions to avoid conflict
  }

  const recipes = await Recipe.find(conditions)
    .select(fields.join(" "))
    .limit(number)
    .lean();

  // Rename _id to id in the result
  return recipes.map((recipe) => {
    recipe.id = recipe._id.toString(); // Convert ObjectId to string if needed
    delete recipe._id; // Remove the original _id field
    return recipe;
  });
};

/**
 * Find recipes that match at least one ingredient and apply optional filters (boolean, diet, cuisine).
 * @param {Array} ingredientTitles - List of ingredient names (e.g., ["tomato", "cheese"])
 * @param {Array} fields - Fields to select (e.g., ["title", "image", "dairyFree"])
 * @param {Number} number - Max number of results to return
 * @param {Object} filters - Additional filters (boolean flags, cuisine, diet)
 * @returns {Array} - Filtered recipes
 */




export const getRecipesByIngredients = async (ingredientTitles = [], fields = [], number = 10, filters = {}) => {
  try {

    //  Ensure ingredientTitles is ALWAYS an array
    if (typeof ingredientTitles === "string") {
      ingredientTitles = ingredientTitles.split(",").map(i => i.trim());
    }

    if (!Array.isArray(ingredientTitles) || ingredientTitles.length === 0) {
      console.error(" No valid ingredients provided. Exiting early...");
      return [];
    }


    //  Case-insensitive regex match
    const ingredientConditions = ingredientTitles.map((title) => ({
      "ingredients.title": { $regex: new RegExp(title, "i") },
    }));


    if (!ingredientConditions.length) {
      console.error(" ingredientConditions is empty. Exiting...");
      return [];
    }

    // ✅ Ensure fields include necessary details
    const selectedFields = fields.length ? fields.join(" ") : "title image summary cuisines diets vegetarian vegan glutenFree dairyFree";
    console.log(" Selected Fields:", selectedFields);

    console.log(" Executing MongoDB Query...");
    const rawRecipes = await Recipe.find({ $or: ingredientConditions })
      // .select(selectedFields)
      .limit(number * 3)
      .lean();

    
        // Rename _id to id in the result
    return rawRecipes.map((recipe) => {
      recipe.id = recipe._id.toString(); // Convert ObjectId to string if needed
      delete recipe._id; // Remove the original _id field
      return recipe;
    });
    } catch (error) {
      console.error(" Error in getRecipesByIngredients:", error);
      return [];
    }
};



export const saveRecipeDetails = async (details) => {

  const sourceId = details.id.toString();

  //  Check for existing recipe by sourceId
  const existing = await Recipe.findOne({ sourceId });
  if (existing) {
    console.debug(` Recipe with sourceId ${sourceId} already exists. Skipping save.`);
    return existing; 
  }
  // Prepare recipe data
  const recipeData = {
    // sourceId: details.id.toString(),
    sourceId,
    source: "spoonacular",
    title: details.title,
    image: details.image,
    summary: details.summary,
    vegetarian: details.vegetarian,
    vegan: details.vegan,
    glutenFree: details.glutenFree,
    dairyFree: details.dairyFree,
    preparationMinutes: details.preparationMinutes,
    cookingMinutes: details.cookingMinutes,
    readyInMinutes: details.readyInMinutes,
    likes: details.aggregateLikes,
    servings: details.servings,
    cuisines: details.cuisines || [],
    dishTypes: details.dishTypes || [],
    diets: details.diets || [],
    ingredients: details.extendedIngredients.map((ing) => ({
      title: ing.name,
      image: `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`,
      amount: ing.amount,
      unit: ing.unit || "",
    })),
    instructions: details.analyzedInstructions.flatMap((instr) =>
      instr.steps.map((step) => step.step)
    ),
    nutrition: {
      nutrients: details.nutrition?.nutrients?.map(n => ({
        name: n.name,
        amount: n.amount,
        unit: n.unit,
        percentOfDailyNeeds: n.percentOfDailyNeeds || 0
      })) || [],
      properties: details.nutrition?.properties?.map(p => ({
        name: p.name,
        amount: p.amount,
        unit: p.unit
      })) || []
    }
  };

  // Insert recipe into DB
  const newRecipe = new Recipe(recipeData);
  const savedRecipe = await newRecipe.save();
  return savedRecipe;
};

export const getRecipeInfoById = async (id, fields = "") => {
  return await Recipe.findById(id)
    .select(fields || "")
    .lean();
};
