/**
 * @swagger
 * components:
 *   schemas:
 *     UserFavourites:
 *       type: object
 *       properties:
 *         firebaseUid:
 *           type: string
 *           description: The Firebase UID of the user (foreign key referencing the Users collection).
 *         recipeIds:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of recipe IDs (foreign keys referencing the Recipes collection) that the user has marked as favourites.
 *       required:
 *         - firebaseUid
 *         - recipeIds
 */

import mongoose from "mongoose";

const userFavouritesSchema = new mongoose.Schema({
  firebaseUid: {
    type: String, // Firebase UID (FK referencing Users collection)
    required: true,
  },
  recipeIds: [
    {
      type: String, // FK referencing Recipes collection
      required: true,
    },
  ],
});

const UserFavourites = mongoose.model("UserFavourites", userFavouritesSchema);

export default UserFavourites;
