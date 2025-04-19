import mongoose from "mongoose";

const similarRecipesSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: true,
    unique: true,
  },
  similarIds: [
    {
      recipeId: {
        type: String,
        required: true,
      },
    },
  ],
});

const SimilarRecipe = mongoose.model("SimilarRecipes", similarRecipesSchema);

export default SimilarRecipe;
