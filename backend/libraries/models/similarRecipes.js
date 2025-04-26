/**
 * @swagger
 * components:
 *   schemas:
 *     SimilarRecipes:
 *       type: object
 *       required:
 *         - recipeId
 *         - similarIds
 *       properties:
 *         recipeId:
 *           type: string
 *           description: The unique ID of the recipe
 *         similarIds:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: string
 *                 description: The ID of a similar recipe
 */

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
