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


// export const getRecipesByIngredients = async (ingredientTitles = [],fields = [],number = 10,filters = {}) => {
//   try {

//     console.log("Function called with:", { ingredientTitles, fields, number, filters });

//     // ✅ Ensure ingredientTitles is ALWAYS an array
//     if (typeof ingredientTitles === "string") {
//         ingredientTitles = ingredientTitles.split(",").map(i => i.trim());  // Convert string to array
//     }

//     if (!Array.isArray(ingredientTitles) || ingredientTitles.length === 0) {
//         console.error("❌ No valid ingredients provided. Exiting early...");
//         return [];
//     }

//     console.log("✅ Ready to match ingredients");

//     // Case-insensitive regex match
//     const ingredientConditions = ingredientTitles.map((title) => ({
//       "ingredients.title": { $regex: new RegExp(title, "i") },
//     }));

//     // Print ingredientConditions before using in query
//     console.log("🔍 Ingredient Conditions Generated:", ingredientConditions);

//     // If ingredientConditions is empty, we should stop here
//     if (!ingredientConditions.length) {
//       console.error("❌ ingredientConditions is empty. Exiting...");
//       return [];
//     }

//     console.log("⏳ Executing MongoDB Query...");
//     const rawRecipes = await Recipe.find({ $or: ingredientConditions })
//       .select(fields.length ? fields.join(" ") : "title image")
//       .limit(number * 3)
//       .lean();

//     console.log(
//       "✅ MongoDB Query Successful! Recipes Found:",
//       rawRecipes.length
//     );
//     console.log("fetched recipes", rawRecipes);

//     // const {
//     //   dairyFree,
//     //   glutenFree,
//     //   vegetarian,
//     //   vegan,
//     //   veryHealthy,
//     //   cheap,
//     //   veryPopular,
//     //   sustainable,
//     //   lowFodmap,
//     //   cuisine,
//     //   diet,
//     // } = filters;

//     // const dietList = diet
//     //   ? diet.split(",").map((d) => d.trim().toLowerCase())
//     //   : [];

//     // // 4️⃣ Filter recipes
//     // const filtered = rawRecipes.filter((recipe) => {
//     //   // Boolean filters
//     //   const matchesBooleans =
//     //     (!dairyFree || recipe.dairyFree) &&
//     //     (!glutenFree || recipe.glutenFree) &&
//     //     (!vegetarian || recipe.vegetarian) &&
//     //     (!vegan || recipe.vegan) &&
//     //     (!veryHealthy || recipe.veryHealthy) &&
//     //     (!cheap || recipe.cheap) &&
//     //     (!veryPopular || recipe.veryPopular) &&
//     //     (!sustainable || recipe.sustainable) &&
//     //     (!lowFodmap || recipe.lowFodmap);

//     //   // Cuisine filter
//     //   const matchesCuisine =
//     //     !cuisine || (recipe.cuisines && recipe.cuisines.includes(cuisine));

//     //   // Diet filter
//     //   const matchesDiet =
//     //     dietList.length === 0 ||
//     //     (recipe.diets &&
//     //       recipe.diets.some((d) => dietList.includes(d.toLowerCase())));

//     //   return matchesBooleans && matchesCuisine && matchesDiet;
//     // });

//     // // 5️⃣ Limit final result
//     // return filtered.slice(0, number).map((recipe) => {
//     //   recipe.id = recipe._id?.toString?.() || recipe.id;
//     //   delete recipe._id;
//     //   return recipe;
//     // });

//     return rawRecipes;
//   } catch (error) {
//     console.error("❌ Error in getRecipesByIngredients:", error);
//     return [];
//   }
// };

export const getRecipesByIngredients = async (ingredientTitles = [], fields = [], number = 10, filters = {}) => {
  try {
    console.log("Function called with:", { ingredientTitles, fields, number, filters });

    // ✅ Ensure ingredientTitles is ALWAYS an array
    if (typeof ingredientTitles === "string") {
      ingredientTitles = ingredientTitles.split(",").map(i => i.trim());
    }

    if (!Array.isArray(ingredientTitles) || ingredientTitles.length === 0) {
      console.error("❌ No valid ingredients provided. Exiting early...");
      return [];
    }

    console.log("✅ Ready to match ingredients");

    // ✅ Case-insensitive regex match
    const ingredientConditions = ingredientTitles.map((title) => ({
      "ingredients.title": { $regex: new RegExp(title, "i") },
    }));

    console.log("🔍 Ingredient Conditions Generated:", ingredientConditions);

    if (!ingredientConditions.length) {
      console.error("❌ ingredientConditions is empty. Exiting...");
      return [];
    }

    // ✅ Ensure fields include necessary details
    const selectedFields = fields.length ? fields.join(" ") : "title image summary cuisines diets vegetarian vegan glutenFree dairyFree";
    console.log("🔍 Selected Fields:", selectedFields);

    console.log("⏳ Executing MongoDB Query...");
    const rawRecipes = await Recipe.find({ $or: ingredientConditions })
      // .select(selectedFields)
      .limit(number * 3)
      .lean();

    console.log("✅ MongoDB Query Successful! Recipes Found:", rawRecipes.length);
    console.log("📝 Raw Recipe Results:", rawRecipes);

    // return rawRecipes;
      // Rename _id to id in the result
  return rawRecipes.map((recipe) => {
    recipe.id = recipe._id.toString(); // Convert ObjectId to string if needed
    delete recipe._id; // Remove the original _id field
    return recipe;
  });
  } catch (error) {
    console.error("❌ Error in getRecipesByIngredients:", error);
    return [];
  }
};



export const saveRecipeDetails = async (details) => {
  // Prepare recipe data
  const recipeData = {
    sourceId: details.id.toString(),
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
