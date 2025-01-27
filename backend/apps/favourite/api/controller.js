import { decodeFirebaseIdToken } from '../../../libraries/firebase.js';
import { findUserByFirebaseUid } from '../../../libraries/models/users.js';
import { 
  findRecipesByIds,
  findFavouriteRecipeBySpoonacularId,
  addFavouriteRecipe,
  findUploadedRecipeById
} from '../db.js';

export const favouriteRecipesFinder = async (req, res) => {
  try {
    const { uid } = await decodeFirebaseIdToken(req.headers.authorization);
    const user = await findUserByFirebaseUid(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const favouriteRecipes = user.favouriteRecipes;

    const spoonacularIds = filterRecipeIdsBySource('spoonacular', favouriteRecipes);
    const uploadedIds = filterRecipeIdsBySource('upload', favouriteRecipes);

    const recipes = await findRecipesByIds(spoonacularIds, uploadedIds);

    return res.status(200).json({ recipes });
  } catch (error) {
    console.error('Get favourite recipes error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const favouriteRecipesAdder = async (req, res) => {
  try {
    const { uid } = await decodeFirebaseIdToken(req.headers.authorization);
    const user = await findUserByFirebaseUid(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { source, recipeId, spoonacularId, title, image, likes } = req.body;

    if (isRecipeAlreadyInFavourites(user.favouriteRecipes, recipeId, source)) {
      return res.status(400).json({ error: 'Recipe is already in favourites' });
    }
    
    if (source === 'upload') {
      const uploadedRecipe = await addUploadedRecipe(recipeId, source);
      user.favouriteRecipes.push({ recipeId: uploadedRecipe._id, source });
    } else if (source === 'spoonacular') {
      const existingRecipe = await addOrUpdateSpoonacularRecipe(spoonacularId, title, image, likes);
      user.favouriteRecipes.push({ recipeId: existingRecipe._id, source });
    } else {
      return res.status(400).json({ error: 'Invalid source type' });
    }

    await user.save();
    return res.status(200).json({ message: 'Recipe added to favourites' });
  } catch (error) {
    console.error('Add favourite recipe error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Filter the recipe IDs by source.
 * @param {string} sourceName - The source name to filter by.
 * @param {Array} recipes - The list of recipes.
 * @returns {Array} - The list of recipe IDs.
 */
const filterRecipeIdsBySource = (sourceName, recipes) => {
  return recipes
  .filter(recipe => recipe.source === sourceName)
  .map(recipe => recipe.recipeId);
};

/**
 * Check if the recipe is already in the user's favourites.
 * @param {Array} favouriteRecipes - User's current list of favourite recipes.
 * @param {string} recipeId - ID of the recipe.
 * @param {string} source - Source of the recipe.
 * @returns {boolean} - Whether the recipe is already in favourites.
 */
const isRecipeAlreadyInFavourites = (favouriteRecipes, recipeId, source) => {
  return favouriteRecipes.some(
    (recipe) => recipe.recipeId === recipeId && recipe.source === source
  );
};

/**
 * Add or update a spoonacular recipe in the FavouriteRecipe collection.
 * @param {string} spoonacularId - The Spoonacular ID of the recipe.
 * @param {string} title - The title of the recipe.
 * @param {string} image - The image URL of the recipe.
 * @param {number} likes - The number of likes for the recipe.
 * @returns {Object} - The updated or newly created FavouriteRecipe.
 */
const addOrUpdateSpoonacularRecipe = async (spoonacularId, title, image, likes) => {
  let existingRecipe = await findFavouriteRecipeBySpoonacularId(spoonacularId);
  if (existingRecipe) {
    existingRecipe.likes = likes || existingRecipe.likes;
    existingRecipe.title = title || existingRecipe.title;
    existingRecipe.image = image || existingRecipe.image;
    await existingRecipe.save();
    return existingRecipe;
  } else {
    return await addFavouriteRecipe({ spoonacularId, title, image, likes });
  }
};

/**
 * Add an uploaded recipe to the user's favourites.
 * @param {string} recipeId - The ID of the uploaded recipe.
 * @param {string} source - The source of the recipe.
 * @returns {Object} - The uploaded recipe or an error message.
 */
const addUploadedRecipe = async (recipeId, source) => {
  const uploadedRecipe = await findUploadedRecipeById(recipeId);
  if (!uploadedRecipe) {
    throw new Error('Uploaded recipe not found');
  }
  return uploadedRecipe;
};