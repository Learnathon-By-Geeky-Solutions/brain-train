import express from 'express';
import { 
  usernameValidator,
  recipeRecommender
} from './controller.js';

/**
 * USER AUTHENTICATION ROUTER
 * HANDLES USERNAME VALIDATION ENDPOINTS
 */
const router = express.Router();

router.post('/checkUsername', usernameValidator);
router.get('/recommended', recipeRecommender);

export default router;