import UserFavourites from "../../libraries/models/userFavourites.js";
import Recipe from "../../libraries/models/recipes.js";

/**
 * Find recipes by their ids.
 * @param {Array} recipeIds - Ids of favourite recipes.
 * @returns {Array} The recipes.
 */
export const findRecipesByIds = async (recipeIds) => {
  const recipes = await Recipe.find(
    { _id: { $in: recipeIds } },
    "_id title image summary likes",
  );
  return recipes.map((recipe) => ({
    id: recipe._id.toString(),
    title: recipe.title,
    image: recipe.image,
    likes: recipe.likes,
    summary: recipe.summary,
  }));
};

/**
 * Find favourite recipe ids by user firebaseUid.
 * @param {string} uid - The user firebaseUid.
 * @returns {Object|null} The user document containing favourite recipe ids or null.
 */
export const findFavouriteRecipeIdsByUid = async (uid) => {
  return await UserFavourites.findOne({ firebaseUid: uid });
};

/**
 * Creates a new entry in the user's favourites.
 *
 * @param {string} uid - The Firebase UID of the user.
 * @param {string} recipeId - The ID of the recipe to add to the user's favourites.
 * @returns {Promise<void>} A promise that resolves when the entry is created.
 */
export const createUserEntryInUserFavourites = async (uid, recipeId) => {
  const userFavourites = new UserFavourites({
    firebaseUid: uid,
    recipeIds: [recipeId],
  });
  await userFavourites.save();
};
