import mongoose from "mongoose";

const favouriteRecipesSchema = new mongoose.Schema(
  {
    spoonacularId: {
      type: Number,
      required: true,
      unique: true
    },
    title: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      default: '' 
    },
    likes: {
      type: Number,
      default: 0
    }
  },
);

const FavouriteRecipe = mongoose.model('FavouriteRecipe', favouriteRecipesSchema);

export default FavouriteRecipe;
