export const normalizeFilters = (filters) => ({
    minCalories: filters.minCalories ?? null,
    maxCalories: filters.maxCalories ?? null,
    minCarbs: filters.minCarbs ?? null,
    maxCarbs: filters.maxCarbs ?? null,
    minProtein: filters.minProtein ?? null,
    maxProtein: filters.maxProtein ?? null,
    minFat: filters.minFat ?? null,
    maxFat: filters.maxFat ?? null,
    cuisineList: (filters.cuisine || "").split(",").map(c => c.trim().toLowerCase()).filter(Boolean),
    dietList: (filters.diet || "").split(",").map(d => d.trim().toLowerCase()).filter(Boolean),
    booleans: {
      vegetarian: toBoolean(filters.vegetarian),
      vegan: toBoolean(filters.vegan),
      glutenFree: toBoolean(filters.glutenFree),
      dairyFree: toBoolean(filters.dairyFree)
    }
  });
  
  export const extractNutrients = (nutrients = []) => {
    const find = (name) => nutrients.find(n => n.name?.toLowerCase() === name)?.amount || 0;
    return {
      calories: find("calories"),
      carbs: find("carbohydrates"),
      protein: find("protein"),
      fat: find("fat")
    };
  };
  
  export const extractBooleans = (recipe) => ({
    vegetarian: toBoolean(recipe.vegetarian),
    vegan: toBoolean(recipe.vegan),
    glutenFree: toBoolean(recipe.glutenFree),
    dairyFree: toBoolean(recipe.dairyFree)
  });
  
  export const meetsRangeCriteria = (n, f) =>
    (!f.minCalories || n.calories >= f.minCalories) &&
    (!f.maxCalories || n.calories <= f.maxCalories) &&
    (!f.minCarbs || n.carbs >= f.minCarbs) &&
    (!f.maxCarbs || n.carbs <= f.maxCarbs) &&
    (!f.minProtein || n.protein >= f.minProtein) &&
    (!f.maxProtein || n.protein <= f.maxProtein) &&
    (!f.minFat || n.fat >= f.minFat) &&
    (!f.maxFat || n.fat <= f.maxFat);
  
  export const meetsListCriteria = (dataList = [], expectedList = []) =>
    expectedList.length === 0 || (dataList || []).some(d => expectedList.includes(d.toLowerCase()));
  
  export const meetsCuisineCriteria = (cuisines = [], expected = []) =>
    expected.length === 0 || cuisines.some(c => expected.includes(c.toLowerCase()));
  
  export const meetsBooleanCriteria = (actual, expected) =>
    Object.entries(expected).every(([key, val]) => val === null || actual[key] === val);
  
  export const hasAllFields = (r) =>
    "nutrition" in r && "cuisines" in r &&
    "vegetarian" in r && "vegan" in r &&
    "glutenFree" in r && "dairyFree" in r;
  
  const toBoolean = (value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    return null;
  };


  /**
 * Check if all filters are empty (no user criteria provided).
 * Used to skip filtering when nothing is specified.
 * 
 * @param {Object} normalized - Result of normalizeFilters(filters)
 * @returns {boolean}
 */
export const isFilterEmpty = (normalized) => {
    const {
      minCalories, maxCalories,
      minCarbs, maxCarbs,
      minProtein, maxProtein,
      minFat, maxFat,
      cuisineList, dietList,
      booleans
    } = normalized;
  
    return (
      !minCalories && !maxCalories &&
      !minCarbs && !maxCarbs &&
      !minProtein && !maxProtein &&
      !minFat && !maxFat &&
      cuisineList.length === 0 &&
      dietList.length === 0 &&
      Object.values(booleans).every(val => val === null)
    );
  };
  