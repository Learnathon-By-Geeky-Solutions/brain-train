import express from 'express';
import { 
  favouriteRecipesFinder,
  favouriteRecipesAdder,
} from './controller.js';
import {
  validateAddRecipe
} from '../middleware/validators.js';

const router = express.Router();

router.get('/list', favouriteRecipesFinder);
router.post('/addRecipe', validateAddRecipe, favouriteRecipesAdder);

export default router;