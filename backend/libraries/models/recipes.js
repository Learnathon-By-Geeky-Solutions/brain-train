import mongoose from "mongoose";
import ingredientSchema from "./ingredients.js";

const recipeSchema = new mongoose.Schema({
  /**
   * Spoonacular ID of the recipe
   * or firebaseUid of the user uploading the recipe
   */
  sourceId: {
    type: String, 
    required: true
  },
  isUploaded: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ""
  },
  summary: {
    type: String,
    required: true
  },
  vegetarian: {
    type: Boolean,
    default: false
  },
  vegan: {
    type: Boolean,
    default: false
  },
  glutenFree: {
    type: Boolean,
    default: false
  },
  dairyFree: {
    type: Boolean,
    default: false
  },
  preparationMinutes: {
    type: Number,
    default: 0
  },
  cookingMinutes: {
    type: Number,
    default: 0
  },
  readyInMinutes: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  servings: {
    type: Number,
    required: true
  },
  cuisines: {
    type: [String],
    default: []
  },
  dishTypes: {
    type: [String],
    default: []
  },
  diets: {
    type: [String],
    default: []
  },
  instructions: {
    type: [String],
    required: true
  },
  ingredients: [ingredientSchema]
});

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;

export const findRecipeById = async (recipeId) => {
  return await Recipe.findOne({ _id: recipeId });
};

