/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - sourceId
 *         - title
 *         - summary
 *         - servings
 *         - instructions
 *       properties:
 *         sourceId:
 *           type: string
 *           description: Spoonacular ID of the recipe or firebaseUid of the user uploading the recipe
 *         isUploaded:
 *           type: boolean
 *           description: Indicates if the recipe is uploaded by a user
 *           default: false
 *         title:
 *           type: string
 *           description: Title of the recipe
 *         image:
 *           type: string
 *           description: URL of the recipe image
 *           default: ""
 *         summary:
 *           type: string
 *           description: Summary of the recipe
 *         vegetarian:
 *           type: boolean
 *           description: Indicates if the recipe is vegetarian
 *           default: false
 *         vegan:
 *           type: boolean
 *           description: Indicates if the recipe is vegan
 *           default: false
 *         glutenFree:
 *           type: boolean
 *           description: Indicates if the recipe is gluten-free
 *           default: false
 *         dairyFree:
 *           type: boolean
 *           description: Indicates if the recipe is dairy-free
 *           default: false
 *         preparationMinutes:
 *           type: number
 *           description: Preparation time in minutes
 *           default: 0
 *         cookingMinutes:
 *           type: number
 *           description: Cooking time in minutes
 *           default: 0
 *         readyInMinutes:
 *           type: number
 *           description: Total time to prepare the recipe in minutes
 *           default: 0
 *         likes:
 *           type: number
 *           description: Number of likes the recipe has received
 *           default: 0
 *         servings:
 *           type: number
 *           description: Number of servings the recipe makes
 *         cuisines:
 *           type: array
 *           items:
 *             type: string
 *           description: List of cuisines the recipe belongs to
 *           default: []
 *         dishTypes:
 *           type: array
 *           items:
 *             type: string
 *           description: List of dish types the recipe belongs to
 *           default: []
 *         diets:
 *           type: array
 *           items:
 *             type: string
 *           description: List of diets the recipe is suitable for
 *           default: []
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *           description: List of instructions for preparing the recipe
 *         ingredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Ingredient'
 *           description: List of ingredients used in the recipe
 *         nutrition:
 *           $ref: '#/components/schemas/Nutrition'
 *           description: Nutrition information of the recipe
 */
import mongoose from "mongoose";
import ingredientSchema from "./ingredients.js";
import { nutritionSchema } from "./nutrition.js";

const recipeSchema = new mongoose.Schema({
  /**
   * Spoonacular ID of the recipe
   * or firebaseUid of the user uploading the recipe
   */
  sourceId: {
    type: String,
    required: true,
    unique: true,
  },
  isUploaded: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  summary: {
    type: String,
    required: true,
  },
  vegetarian: {
    type: Boolean,
    default: false,
  },
  vegan: {
    type: Boolean,
    default: false,
  },
  glutenFree: {
    type: Boolean,
    default: false,
  },
  dairyFree: {
    type: Boolean,
    default: false,
  },
  preparationMinutes: {
    type: Number,
    default: 0,
  },
  cookingMinutes: {
    type: Number,
    default: 0,
  },
  readyInMinutes: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  servings: {
    type: Number,
    required: true,
  },
  cuisines: {
    type: [String],
    default: [],
  },
  dishTypes: {
    type: [String],
    default: [],
  },
  diets: {
    type: [String],
    default: [],
  },
  instructions: {
    type: [String],
    required: true,
  },
  ingredients: [ingredientSchema],
  nutrition: nutritionSchema,
});

recipeSchema.statics.getTopLikedRecipes = function (n) {
  return this.find().sort({ likes: -1 }).limit(n);
};

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;

export const findRecipeById = async (recipeId) => {
  return await Recipe.findOne({ _id: { $eq: recipeId.toString() } }, null, {
    sanitizeFilter: true,
  });
};
