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
 * Find favourite recipe ids by user firebaseUid.
 * @param {string} uid - The user firebaseUid.
 * @returns {Object} The user's favourite recipe ids.
 */
export const findFavouriteRecipeIdsByUid = async (uid) => {
  return await UserFavourites.findOne({ firebaseUid: uid });
}

export const createUserEntryInUserFavourites = async (uid, recipeId) => {
  const userFavourites = new UserFavourites({
    firebaseUid: uid,
    recipeIds: [recipeId]
  });
  await userFavourites.save();
}
