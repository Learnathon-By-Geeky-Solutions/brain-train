import Recipe from "../../libraries/models/recipes.js";

export const getTopLikedRecipes = async (n) => {
  const limit = Math.max(1, Math.min(parseInt(n, 10) || 10, 25));
  return await Recipe.getTopLikedRecipes(limit);
};
