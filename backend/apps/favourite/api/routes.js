import express from 'express';
import { 
  favouriteRecipesFinder,
  favouriteRecipesAdder,
  favouriteRecipesRemover
} from './controller.js';
import {
  validateAddRecipe,
  validateRemoveRecipe
} from '../middleware/validators.js';

const router = express.Router();

router.get('/list', favouriteRecipesFinder);
router.post('/addRecipe', validateAddRecipe, favouriteRecipesAdder);
router.delete('/removeRecipe', validateRemoveRecipe, favouriteRecipesRemover);

export default router;