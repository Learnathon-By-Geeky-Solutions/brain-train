import Recipe from "../../libraries/models/recipes.js";

export const getRecipeFieldsByParams = async (conditions, fields, number) => {
  if (conditions.query) {
    conditions.title = { $regex: conditions.query, $options: 'i' }; // Case-insensitive search
    delete conditions.query; // Remove the 'query' key from conditions to avoid conflict
  }

  const recipes = await Recipe.find(conditions).select(fields.join(' ')).limit(number).lean();

  // Rename _id to id in the result
  return recipes.map(recipe => {
    recipe.id = recipe._id.toString(); // Convert ObjectId to string if needed
    delete recipe._id; // Remove the original _id field
    return recipe;
  });
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
      ingredients: details.extendedIngredients.map(ing => ({
          title: ing.name,
          image: `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`,
          amount: ing.amount,
          unit: ing.unit || ""
      })),
      instructions: details.analyzedInstructions.flatMap(instr => instr.steps.map(step => step.step))
  };

  // Insert recipe into DB
  const newRecipe = new Recipe(recipeData);
  const savedRecipe = await newRecipe.save();
  return savedRecipe;
};
