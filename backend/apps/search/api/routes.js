import express from 'express';
import {
    searchRecipes,
    searchRecipesByIngredients,
    searchRecipesByNutrients,
    getRecipeInformation,
    getRecipeSummary,
    getSimilarRecipes,
    autoCompleteIngredients,
    autoCompleteRecipes,
    getSearchesFromHistory
} from './controller.js';

const router = express.Router();

router.get('/recipes', searchRecipes);
router.get('/recipes/ingredients', searchRecipesByIngredients);
router.get('/recipes/nutrients', searchRecipesByNutrients);
router.get('/recipes/:id', getRecipeInformation);
router.get('/recipes/:id/summary', getRecipeSummary);
router.get('/recipes/:id/similar', getSimilarRecipes);

// Autocomplete endpoints
router.get('/title/autocomplete', autoCompleteRecipes);
router.get('/ingredients/autocomplete', autoCompleteIngredients);

router.get('/history/:n', getSearchesFromHistory);

export default router;
