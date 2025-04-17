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
      console.error("Get favourite recipes error:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    });
};

export const favouriteRecipesAdder = (req, res) => {
  const { recipeId } = req.body;
  const id = recipeId.toString();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid recipe ID" });
  }

  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => {
      return findRecipeById(id).then((recipe) => ({ uid, id, recipe }));
    })
    .then(({ uid, id, recipe }) => {
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      return findFavouriteRecipeIdsByUid(uid).then((userFavourites) => ({
        uid,
        id,
        userFavourites,
      }));
    })
    .then(({ uid, id, userFavourites }) => {
      if (!userFavourites) {
        return createUserEntryInUserFavourites(uid, id).then(() =>
          res.status(201).json({ message: "Recipe added to favourites" }),
        );
      }

      if (userFavourites.recipeIds.includes(id)) {
        return res.status(409).json({ error: "Recipe already in favourites" });
      }

      userFavourites.recipeIds.push(id);
      return userFavourites
        .save()
        .then(() =>
          res.status(200).json({ message: "Recipe added to favourites" }),
        );
    })
    .catch((error) => {
      console.error("Add favourite recipe error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    });
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
      console.error("Remove favourite recipe error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    });
};
