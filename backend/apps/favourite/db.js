import UserFavourites from '../../libraries/models/userFavourites.js';
import Recipe from '../../libraries/models/recipes.js';

/**
 * Find recipes by their ids.
 * @param {Array} recipeIds - Ids of favourite recipes.
 * @returns {Array} The recipes.
 */
export const findFavouriteRecipesByIds = async (recipeIds) => {
  try {
    const recipes = await Recipe.find(
      { _id: { $in: recipeIds } },
      "_id title image likes"
    );
    const formattedRecipes = recipes.map(recipe => ({
      recipeId: recipe._id.toString(), // Change _id to recipeId
      title: recipe.title,
      image: recipe.image,
      likes: recipe.likes
    }));
    return formattedRecipes;
  } catch (error) {
    console.error('Find recipes by ids error:', error.message);
    return [];
  }
}

/**
 * Find a favourite recipe by spoonacularId.
 * @param {string} spoonacularId - The spoonacularId of the recipe.
 * @returns {Object} The favourite recipe object.
 */
export const findFavouriteRecipeBySpoonacularId = async (spoonacularId) => {
  return await FavouriteRecipe.findOne({ spoonacularId });
};

/**
 * Add a new favourite recipe to the FavouriteRecipes collection.
 * @param {Object} recipe - The recipe object to add.
 * @returns {Object} The saved recipe object.
 */
export const addFavouriteSpoonacularRecipe = async (recipe) => {
  const newRecipe = new FavouriteRecipe({
    spoonacularId: recipe.spoonacularId,
    title: recipe.title,
    image: recipe.image,
    likes: recipe.likes,
  });
  await newRecipe.save();
  return newRecipe;
};

/**
 * Find an uploaded recipe by its _id.
 * @param {string} recipeId - The _id of the uploaded recipe.
 * @returns {Object} The uploaded recipe object.
 */
export const findUploadedRecipeById = async (recipeId) => {
  return await UploadedRecipe.findById(recipeId);
};

/**
 * Updates the properties of an existing Spoonacular recipe.
 * @param {Object} existingRecipe - The existing recipe object to be updated.
 * @param {string} [title] - The new title for the recipe. If not provided, the existing title will be retained.
 * @param {string} [image] - The new image URL for the recipe. If not provided, the existing image URL will be retained.
 * @param {number} [likes] - The new number of likes for the recipe. If not provided, the existing number of likes will be retained.
 * @returns {Promise<void>} A promise that resolves when the recipe has been successfully updated and saved.
 */
export const updateSpoonacularRecipe = async (existingRecipe, title, image, likes) => {
  existingRecipe.likes = likes || existingRecipe.likes;
  existingRecipe.title = title || existingRecipe.title;
  existingRecipe.image = image || existingRecipe.image;
  await existingRecipe.save();
};

/**
 * Find favourite recipe ids by user firebaseUid.
 * @param {string} uid - The user firebaseUid.
 * @returns {Object} The user's favourite recipe ids.
 */
export const findFavouriteRecipeIdsByUid = async (uid) => {
  return await UserFavourites.findOne({ userId: uid });
}
