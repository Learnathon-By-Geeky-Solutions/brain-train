import { spoonacularRequest } from "../../../libraries/services/spoonacular.js";
import { getRecipeFieldsByTitle } from "../db.js";
import { fetchSaveFilterRecipes } from "./fetchHelper.js";

export const getDbSuggestions = (query, number) =>
  getRecipeFieldsByTitle(query, ["_id", "title"], number, true).then(
    (dbResults) => {
      const suggestions = dbResults.map((r) => ({
        id: r.id,
        title: r.title,
      }));
      console.log("🔍 DB Suggestions:", suggestions);
      return suggestions;
    },
  );

export const getApiSuggestions = (query, number, existingSuggestions) => {
  const seenTitles = new Set(
    existingSuggestions.map((s) => s.title.toLowerCase()),
  );

  return spoonacularRequest("/recipes/autocomplete", { query, number }).then(
    (apiResults) => {
      const apiIds = apiResults.map((r) => r.id);
      console.log("🌐 API Recipe IDs:", apiIds);

      const newRecipes = apiResults.filter(
        (r) => !seenTitles.has(r.title.toLowerCase()),
      );

      return fetchSaveFilterRecipes(apiIds, {}).then(() => [
        ...existingSuggestions,
        ...newRecipes,
      ]);
    },
  );
};
