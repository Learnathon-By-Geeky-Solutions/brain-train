import FavouriteRecipe from '../../libraries/models/favouriteRecipes.js';
import UploadedRecipe from '../../libraries/models/uploadedRecipes.js';

/**
 * Find recipes by their ids.
 * @param {Array} spoonacularIds - The spoonacular ids of the recipes.
 * @param {Array} uploadedIds - The uploaded ids of the recipes.
 * @returns {Array} The recipes.
 */
export const findRecipesByIds = async (spoonacularIds, uploadedIds) => {
  try {
    const [spoonacularRecipes, uploadedRecipes] = await Promise.all([
      FavouriteRecipe.find({ _id: { $in: spoonacularIds } }, '_id spoonacularId likes title image'),
      UploadedRecipe.find({ _id: { $in: uploadedIds } }, '_id likes title image')
    ]);
    const recipes = [
      ...spoonacularRecipes.map(recipe => ({
        _id: recipe._id,
        source: 'spoonacular',
        spoonacularId: recipe.spoonacularId,
        likes: recipe.likes,
        title: recipe.title,
        image: recipe.image
      })),
      ...uploadedRecipes.map(recipe => ({
        _id: recipe._id,
        source: 'upload',
        likes: recipe.likes,
        title: recipe.title,
        image: recipe.image
      }))
    ];
    return recipes;
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
