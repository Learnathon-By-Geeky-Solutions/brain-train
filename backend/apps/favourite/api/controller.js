import { decodeFirebaseIdToken } from "../../../libraries/services/firebase.js";
import { findRecipeById } from "../../../libraries/models/recipes.js";
import {
  findRecipesByIds,
  findFavouriteRecipeIdsByUid,
  createUserEntryInUserFavourites,
} from "../db.js";
import mongoose from "mongoose";

export const favouriteRecipesFinder = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => handleFindFavouriteRecipes(uid, res))
    .catch((error) => handleError(error, res));
};

const handleFindFavouriteRecipes = (uid, res) => {
  findFavouriteRecipeIdsByUid(uid)
    .then((userFavourites) => {
      if (!userFavourites || userFavourites.recipeIds.length === 0) {
        return res.status(200).json({ recipes: [] });
      }
      return findRecipesByIds(userFavourites.recipeIds).then((recipes) =>
        res.status(200).json({ recipes }),
      );
    })
    .catch((error) => handleError(error, res));
};

export const favouriteRecipesAdder = (req, res) => {
  const { recipeId } = req.body;
  const id = recipeId?.toString();

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid recipe ID" });
  }

  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => handleRecipeAdd(uid, id, res))
    .catch((error) => handleError(error, res));
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleRecipeAdd = (uid, id, res) => {
  findRecipeById(id)
    .then((recipe) => {
      if (!recipe) {
        return handleNotFound(res, "Recipe not found");
      }
      return findFavouriteRecipeIdsByUid(uid).then((favs) =>
        handleFavourites(uid, id, favs, res),
      );
    })
    .catch((error) => handleError(error, res));
};

const handleFavourites = (uid, id, userFavourites, res) => {
  if (!userFavourites) {
    return createUserEntryInUserFavourites(uid, id).then(() =>
      res.status(201).json({ message: "Recipe added to favourites" }),
    );
  }

  if (userFavourites.recipeIds.includes(id)) {
    return handleConflict(res, "Recipe already in favourites");
  }

  userFavourites.recipeIds.push(id);
  return userFavourites
    .save()
    .then(() =>
      res.status(201).json({ message: "Recipe added to favourites" }),
    );
};

export const favouriteRecipesRemover = (req, res) => {
  const { recipeId } = req.body;
  const id = recipeId?.toString();

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid recipe ID" });
  }

  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => handleRecipeRemove(uid, id, res))
    .catch((error) => handleError(error, res));
};

const handleRecipeRemove = (uid, id, res) => {
  findFavouriteRecipeIdsByUid(uid)
    .then((userFavourites) => {
      if (!userFavourites?.recipeIds?.includes(id)) {
        return handleNotFound(res, "Recipe not in favourites");
      }

      userFavourites.recipeIds = userFavourites.recipeIds.filter(
        (recipeId) => recipeId !== id,
      );
      return userFavourites
        .save()
        .then(() =>
          res.status(200).json({ message: "Recipe removed from favourites" }),
        );
    })
    .catch((error) => handleError(error, res));
};

const handleNotFound = (res, message) => {
  res.status(404).json({ error: message });
  throw new Error(`Handled: ${message}`);
};

const handleConflict = (res, message) => {
  res.status(409).json({ error: message });
  throw new Error(`Handled: ${message}`);
};

const handleError = (error, res) => {
  if (error.message.startsWith("Handled:")) return;
  if (!res.headersSent) {
    res.status(500).json({ error: error.message });
  }
};
