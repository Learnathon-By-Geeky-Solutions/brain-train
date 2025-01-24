import express from 'express';
import {
    searchRecipes,
    searchRecipesByIngredients,
    getRecipeInformation,
    getRecipeSummary,
    
    autoCompleteIngredients,
    autoCompleteRecipes
} from './controller.js';

const router = express.Router();

router.get('/recipes', searchRecipes);
router.get('/recipes/ingredients', searchRecipesByIngredients);
router.get('/recipes/:id', getRecipeInformation);
router.get('/recipes/:id/summary', getRecipeSummary);

// Autocomplete endpoints
router.get('/title/autocomplete', autoCompleteRecipes);
router.get('/ingredients/autocomplete', autoCompleteIngredients);

export default router;
