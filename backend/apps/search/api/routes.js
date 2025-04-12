import express from 'express';
import {
    searchRecipes,
    searchRecipesByIngredients,
    searchRecipesByNutrients,
    getRecipesByCuisine,
    getRecipeInformation,
    getRecipeSummary,
    getSimilarRecipes,
    getShoppingList,
    autoCompleteIngredients,
    autoCompleteRecipes,
    getSearchesFromHistory,
} from './controller.js';

const router = express.Router();

router.get('/recipes', searchRecipes);
router.get('/recipes/ingredients', searchRecipesByIngredients);
router.get('/recipes/nutrients', searchRecipesByNutrients);
router.get('/recipes/cuisines', getRecipesByCuisine);
router.get('/recipes/:id', getRecipeInformation);
router.get('/recipes/:id/summary', getRecipeSummary);
router.get('/recipes/:id/similar', getSimilarRecipes);
router.get('/recipes/:id/shoppingList', getShoppingList);


// Autocomplete endpoints
router.get('/title/autocomplete', autoCompleteRecipes);
router.get('/ingredients/autocomplete', autoCompleteIngredients);

router.get('/history/:n', getSearchesFromHistory);

export default router;
