
  /**
   * Normalize recipe IDs for frontend compatibility.
   * @param {Object[]} recipes - List of DB recipes.
   * @returns {Object[]} - Recipes with stringified `id`.
   */
  export const normalizeIds = (recipes) =>
    recipes.map((r) => ({
      ...r,
      id: r._id?.toString() || r.id
    }));
  


  export const minimizeRecipeData = (recipes) => {
    return recipes.map(recipe => ({
      _id: recipe._id || recipe.id,
      id: recipe._id || recipe.id,
      title: recipe.title,
      image: recipe.image,
      summary: recipe.summary,
      likes: recipe.likes
    }));
  };
  
  export const respondWithResults = (res, data) => {
    const minimized= formatRecipes(data);
    return res.status(200).json({ results: minimized, totalResults: minimized.length });
  };
  export const formatRecipes = (data) => {
    console.log("Formatting Recipes:", data);
    const normalized = normalizeIds(data);
    const minimized = minimizeRecipeData(normalized);
    return minimized;
  }


  
  export const mergeAndLimitResults = (dbResults, apiResults, limit) => {
    const combined = [...dbResults, ...apiResults];
    const unique = combined.filter((item, index, self) => {
      return self.findIndex(r => String(r._id || r.id) === String(item._id || item.id)) === index;
    });
    return unique.slice(0, limit);
  };
