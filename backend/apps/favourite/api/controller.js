import { decodeFirebaseIdToken } from '../../../libraries/firebase.js';
import { findUserByFirebaseUid } from '../../../libraries/models/users.js';
import { 
  findFavouriteRecipesByIds,
  addFavouriteSpoonacularRecipe,
  findUploadedRecipeById,
  findFavouriteRecipeBySpoonacularId,
  updateSpoonacularRecipe,
  findFavouriteRecipeIdsByUid
} from '../db.js';

export const favouriteRecipesFinder = async (req, res) => {
  try {
    const { uid } = await decodeFirebaseIdToken(req.headers.authorization);

    const userFavourites = await findFavouriteRecipeIdsByUid(uid);

    if (!userFavourites || userFavourites.recipeIds.length === 0) {
      return res.status(404).json({ error: 'No favourite recipes found' });
    }

    const recipes = await findFavouriteRecipesByIds(userFavourites.recipeIds);

    return res.status(200).json({ recipes });
  } catch (error) {
    console.error('Get favourite recipes error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const favouriteRecipesAdder = async (req, res) => {
  try {
    const { uid } = await decodeFirebaseIdToken(req.headers.authorization);
    const user = await findUserByFirebaseUid(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { source, recipeId, spoonacularId, title, image, likes } = req.body;
    let recipeToAdd;

    if (source === 'upload') {
      recipeToAdd = await findUploadedRecipeById(recipeId);
      if (!recipeToAdd) {
        return res.status(404).json({ error: 'Uploaded recipe not found' });
      }
      recipeToAdd = { recipeId: recipeToAdd._id, source };
    } else if (source === 'spoonacular') {
      let existingRecipe = await findFavouriteRecipeBySpoonacularId(spoonacularId);

      if (existingRecipe) {
        await updateSpoonacularRecipe(existingRecipe, title, image, likes);
        recipeToAdd = { recipeId: existingRecipe._id.toString(), source };
      } else {
        const newRecipe = await addFavouriteSpoonacularRecipe({ spoonacularId, title, image, likes });
        recipeToAdd = { recipeId: newRecipe._id.toString(), source };
      }
    } else {
      return res.status(400).json({ error: 'Invalid source type' });
    }

    if (isRecipeAlreadyInUserFavourites(user.favouriteRecipes, recipeToAdd.recipeId)) {
      return res.status(400).json({ error: 'Recipe is already in favourites' });
    }
    
    user.favouriteRecipes.push(recipeToAdd);
    await user.save();

    return res.status(200).json({ message: 'Recipe added to favourites' });
  } catch (error) {
    console.error('Add favourite recipe error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const favouriteRecipesRemover = async (req, res) => {
  try {
    const { uid } = await decodeFirebaseIdToken(req.headers.authorization);
    const user = await findUserByFirebaseUid(uid);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { recipeId } = req.body;

    const recipeIndex = user.favouriteRecipes.findIndex(
      (recipe) => recipe.recipeId === recipeId
    );

    if (recipeIndex === -1) {
      return res.status(404).json({ error: 'Recipe not found in favourites' });
    }

    user.favouriteRecipes.splice(recipeIndex, 1);
    await user.save();

    return res.status(200).json({ message: 'Recipe removed from favourites' });
  } catch (error) {
    console.error('Remove favourite recipe error:', error.message);
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
 * Check if the recipe is already in the user object's favouriteRecipes field
 * Applicable for uploaded recipes only
 * @param {Array} favouriteRecipes - User's current list of favourite recipes.
 * @param {string} recipeId - ID of the recipe.
 * @returns {boolean} - Whether the recipe is already in favourites.
 */
const isRecipeAlreadyInUserFavourites = (favouriteRecipes, recipeId) => {
  return favouriteRecipes.some(
    (recipe) => recipe.recipeId === recipeId
  );
};
