import express from 'express';
import { analyzeImageIngredients } from './controller.js';

const router = express.Router();

router.post('/analyze', analyzeImageIngredients);

export default router;
