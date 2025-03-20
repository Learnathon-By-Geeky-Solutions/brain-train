import { decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';
import { findRecipeById } from '../../../libraries/models/recipes.js';
import { 
  findFavouriteRecipesByIds,
  findFavouriteRecipeIdsByUid,
  createUserEntryInUserFavourites
} from '../db.js';

export const favouriteRecipesFinder = async (req, res) => {
  try {
    const { uid } = await decodeFirebaseIdToken(req.headers.authorization);

    const userFavourites = await findFavouriteRecipeIdsByUid(uid);

    if (!userFavourites || userFavourites.recipeIds.length === 0) {
      return res.status(200).json({ recipes: []});
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
    const { recipeId } = req.body;

    const recipe = await findRecipeById(recipeId);
    if (!recipe) {
      return res.status(400).json({ error: 'Recipe not found' });
    }

    let userFavourites = await findFavouriteRecipeIdsByUid(uid);

    if (!userFavourites) {
      await createUserEntryInUserFavourites(uid, recipeId);
      return res.status(201).json({ message: 'Recipe added to favourites' });
    }

    if (!userFavourites.recipeIds.includes(recipeId)) {
      userFavourites.recipeIds.push(recipeId);
      await userFavourites.save();
      return res.status(200).json({ message: 'Recipe added to favourites' });
    } else {
      return res.status(400).json({ error: 'Recipe already in favourites' });
    }
  } catch (error) {
    console.error('Add favourite recipe error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const favouriteRecipesRemover = async (req, res) => {
  try {
    const { uid } = await decodeFirebaseIdToken(req.headers.authorization);
    const { recipeId } = req.body;

    let userFavourites = await findFavouriteRecipeIdsByUid(uid);
    let recipeIndex = -1;

    if (!userFavourites) {
      return res.status(400).json({ error: 'Recipe not in favourites' });
    } else {
      recipeIndex = userFavourites.recipeIds.indexOf(recipeId);
      if (recipeIndex === -1) {
        return res.status(400).json({ error: 'Recipe not in favourites' });
      }
    }

    userFavourites.recipeIds.splice(recipeIndex, 1);
    await userFavourites.save();

    return res.status(200).json({ message: 'Recipe removed from favourites' });
  } catch (error) {
    console.error('Remove favourite recipe error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
