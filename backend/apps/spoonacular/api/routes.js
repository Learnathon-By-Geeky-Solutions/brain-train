import express from 'express';
import {
    searchRecipes,
    searchRecipesByIngredients,
    getRecipeInformation,
} from './controller.js';

const router = express.Router();

router.get('/recipes', searchRecipes);
router.get('/recipes/ingredients', searchRecipesByIngredients);
router.get('/recipes/:id', getRecipeInformation);

export default router;
