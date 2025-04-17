import escapeRegex from "escape-string-regexp";
import Recipe from "../../libraries/models/recipes.js";
import UserSearchHistory from "../../libraries/models/userSearchHistory.js";

export const getRecipeFieldsByTitle = async (
  title,
  fields,
  number,
  isAutoComplete = false,
) => {
  const conditions = {};

  if (typeof title === "string" && title.trim() !== "") {
    conditions.title = isAutoComplete
      ? { $regex: new RegExp(`\\b${escapeRegex(title)}`, "i") }
      : { $regex: escapeRegex(title), $options: "i" };
  }

  const recipes = await Recipe.find(conditions)
    .select(fields.join(" "))
    .limit(number * 3)
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

export const getRecipesByIngredients = async (
  ingredientTitles = [],
  fields = [],
  number = 10,
  filters = {},
) => {
  try {
    //  Ensure ingredientTitles is ALWAYS an array
    if (typeof ingredientTitles === "string") {
      ingredientTitles = ingredientTitles.split(",").map((i) => i.trim());
    }

    if (!Array.isArray(ingredientTitles) || ingredientTitles.length === 0) {
      console.error(" No valid ingredients provided. Exiting early...");
      return [];
    }

    //  Case-insensitive regex match
    const ingredientConditions = ingredientTitles.map((title) => ({
      "ingredients.title": { $regex: new RegExp(escapeRegex(title), "i") },
    }));

    if (!ingredientConditions.length) {
      console.error(" ingredientConditions is empty. Exiting...");
      return [];
    }

    console.log("fieldsarray", fields);
    //  Ensure fields include necessary details
    const selectedFields = fields.length
      ? fields.join(" ")
      : "title image summary likes";
    console.log(" Selected Fields:", selectedFields);

    console.log(" Executing MongoDB Query...");
    const rawRecipes = await Recipe.find({ $or: ingredientConditions })
      .select(selectedFields)
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
  // Prepare recipe data
  const recipeData = {
    sourceId: details.id.toString(),
    isUploaded: details.isUploaded || false,
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
      instr.steps.map((step) => step.step),
    ),
    nutrition: {
      nutrients:
        details.nutrition?.nutrients?.map((n) => ({
          name: n.name,
          amount: n.amount,
          unit: n.unit,
          percentOfDailyNeeds: n.percentOfDailyNeeds || 0,
        })) || [],
      properties:
        details.nutrition?.properties?.map((p) => ({
          name: p.name,
          amount: p.amount,
          unit: p.unit,
        })) || [],
    },
  };

  await Recipe.updateOne(
    { sourceId: recipeData.sourceId }, // Match by sourceId
    { $set: recipeData }, // Set the entire new data
    { upsert: true }, // Insert if not exists
  );

  const savedRecipe = await Recipe.findOne({
    sourceId: recipeData.sourceId,
  }).lean();
  return savedRecipe;
};

export const getRecipeBySourceId = async (sourceIds = [], fields = null) => {
  return await Recipe.find({ sourceId: { $in: sourceIds } })
    .select(fields)
    .lean();
};

export const getRecipeInfoById = async (id, fields = null) => {
  return await Recipe.findById(id).select(fields).lean();
};

export const searchRecipesByCuisine = async (cuisine, limit = 10) => {
  const pipeline = [
    {
      $match: {
        cuisines: {
          $elemMatch: {
            $regex: new RegExp(escapeRegex(cuisine), "i"), // partial & case-insensitive
          },
        },
      },
    },
    { $sample: { size: parseInt(limit) } },
    {
      $project: {
        _id: 1,
        title: 1,
        image: 1,
        summary: 1,
        likes: 1,
      },
    },
  ];

  const results = await Recipe.aggregate(pipeline);
  return results;
};

export const getSearchHistoryByUid = async (uid) => {
  try {
    return await UserSearchHistory.findOne({ firebaseUid: uid });
  } catch (error) {
    console.error("Find user search history error:", error.message);
    return null;
  }
};

export const createUserEntryInUserSearchHistory = async (uid, recipeId) => {
  const userSearchHistory = new UserSearchHistory({
    firebaseUid: uid,
    history: [
      {
        recipeId: recipeId,
        searchedAt: Date.now(),
      },
    ],
  });
  await userSearchHistory.save();
};
