import SimilarRecipe from "../../libraries/models/similarRecipes.js";
import Recipe from "../../libraries/models/recipes.js";
import mongoose from 'mongoose';

export const getSimilarRecipesById = async (recipeId) => {
  const _recipeId = recipeId.toString();
  if (mongoose.Types.ObjectId.isValid(_recipeId)) return await SimilarRecipe.findOne({ recipeId: { $eq: _recipeId } }, null, { sanitizeFilter: true });
  throw new Error("Invalid recipeId");
};

export const getRecipeBySourceId = async (sourceId) => {
  if (!Number.isInteger(sourceId) || sourceId <= 0) throw new Error("Invalid sourceId");
  return await Recipe.findOne({ sourceId: { $eq: sourceId.toString() } }, null, { sanitizeFilter: true });
};

const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: ${id}`);
  }
};

const validateObjectIds = (ids) => {
  ids.forEach(validateObjectId);
};

export const createNewSimilarRecipeEntry = async (recipeId, similarRecipeIds) => {
  try {
    validateObjectId(recipeId);
    validateObjectIds(similarRecipeIds);
    const newSimilarRecipe = new SimilarRecipe({
      recipeId: recipeId.toString(),
      similarIds: similarRecipeIds.map(id => ({ recipeId: id }))
    });
    await newSimilarRecipe.save();
  } catch (error) {
    console.error('Error adding similar recipe entry:', error.message);
    throw new Error('Failed to add similar recipes');
  }
};
