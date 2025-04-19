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
