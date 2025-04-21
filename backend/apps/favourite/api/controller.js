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
    .then(({ uid }) => {
      return findFavouriteRecipeIdsByUid(uid).then((userFavourites) => {
        if (!userFavourites || userFavourites.recipeIds.length === 0) {
          return res.status(200).json({ recipes: [] });
        }

        return findRecipesByIds(userFavourites.recipeIds).then((recipes) => {
          return res.status(200).json({ recipes });
        });
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
};

export const favouriteRecipesAdder = (req, res) => {
  const { recipeId } = req.body;
  const id = recipeId?.toString();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid recipe ID" });
  }

  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => handleRecipeAdd(uid, id, res))
    .catch((error) => handleError(error, res));
};

const handleRecipeAdd = (uid, id, res) => {
  return findRecipeById(id).then((recipe) => {
    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
      throw new Error("Handled: Recipe not found");
    }
    return findFavouriteRecipeIdsByUid(uid).then((favs) =>
      handleFavourites(uid, id, favs, res),
    );
  });
};

const handleFavourites = (uid, id, userFavourites, res) => {
  if (!userFavourites) {
    return createUserEntryInUserFavourites(uid, id).then(() => {
      res.status(201).json({ message: "Recipe added to favourites" });
    });
  }

  if (userFavourites.recipeIds.includes(id)) {
    res.status(409).json({ error: "Recipe already in favourites" });
    throw new Error("Handled: Duplicate recipe");
  }

  userFavourites.recipeIds.push(id);
  return userFavourites.save().then(() => {
    res.status(201).json({ message: "Recipe added to favourites" });
  });
};

const handleError = (error, res) => {
  if (error.message.startsWith("Handled:")) return;
  if (!res.headersSent) {
    res.status(500).json({ error: error.message });
  }
};

export const favouriteRecipesRemover = (req, res) => {
  const { recipeId } = req.body;
  const id = recipeId.toString();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid recipe ID" });
  }

  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => {
      return findFavouriteRecipeIdsByUid(uid).then((userFavourites) => ({
        uid,
        id,
        userFavourites,
      }));
    })
    .then(({ id, userFavourites }) => {
      if (!userFavourites?.recipeIds?.includes(id)) {
        return res.status(404).json({ error: "Recipe not in favourites" });
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
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};
