import { getRecipesByIngredients } from "../db.js";
import { filterRecipes} from "./filtering.js";
import { fetchByIngredientSaveFilter } from "./fetchHelper.js";
import { mergeAndLimitResults } from "./formatter.js";


export const RecipesByIngredientsHelper = (query) => {
    const { number = 60, ingredients, fields = "", ...filters } = query;
  
    if (!ingredients) {
      return Promise.reject(new Error("'ingredients' parameter is required."));
    }
  
    const fieldsArray = fields.split(',').map(f => f.trim()).filter(Boolean);
  
    return getRecipesByIngredients(ingredients, fieldsArray, number, filters)
      .then(dbResults => {
        console.log("🔍 DB Results Before Filtering:", dbResults.length);
        return filterRecipes(dbResults, filters)
        })
        .then(filteredDbResults => {

            console.log("🔎 DB Results After Filtering:", filteredDbResults.length);
    
            const threshold = Math.ceil(number * 0.5);
    
            if (filteredDbResults.length >= threshold) {
            return filteredDbResults;
            }
    
            return fetchByIngredientSaveFilter(ingredients, number, filters)
            .then(filteredApiResults => mergeAndLimitResults(filteredDbResults, filteredApiResults, number));
      });
  }