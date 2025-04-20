import { getRecipeInfoById } from "../db.js";

import {
  normalizeFilters,
  extractNutrients,
  extractBooleans,
  meetsRangeCriteria,
  meetsListCriteria,
  meetsCuisineCriteria,
  meetsBooleanCriteria,
  hasAllFields,
  isFilterEmpty,
} from "./filterHelper.js";

export const filterRecipes = async (recipes, filters) => {
  if (!Array.isArray(recipes) || recipes.length === 0) {
    return [];
  }

  const normalized = normalizeFilters(filters);
  // eslint-disable-next-line no-console
  console.log("filters provided is", filters);

  if (isFilterEmpty(normalized)) {
    // eslint-disable-next-line no-console
    console.debug("All filter fields are empty. Returning original recipes.");
    return recipes.map((r) => ({ ...r, id: r._id?.toString() || r.id }));
  }

  const enriched = await Promise.all(recipes.map(ensureFullRecipe));

  return enriched
    .filter((recipe) => {
      const nutrients = extractNutrients(recipe.nutrition?.nutrients);
      const bools = extractBooleans(recipe);

      const matches =
        meetsRangeCriteria(nutrients, normalized) &&
        meetsListCriteria(recipe.diets, normalized.dietList) &&
        meetsCuisineCriteria(recipe.cuisines, normalized.cuisineList) &&
        meetsBooleanCriteria(bools, normalized.booleans);

      return matches;
    })
    .map((r) => ({ ...r, id: r._id?.toString() || r.id }));
};

export const ensureFullRecipe = async (recipe) => {
  if (hasAllFields(recipe)) {
    return recipe;
  }

  const full = await getRecipeInfoById(recipe._id || recipe.id);
  return full;
};
