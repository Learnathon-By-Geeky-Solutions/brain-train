import express from 'express';
import {
    searchRecipes,
    searchRecipesByIngredients,
    getRecipeInformation,
    getRecipeSummary
} from './controller.js';

const router = express.Router();

router.get('/recipes', searchRecipes);
router.get('/recipes/ingredients', searchRecipesByIngredients);
router.get('/recipes/:id', getRecipeInformation);
router.get('/recipes/:id/summary', getRecipeSummary); 

export default router;
