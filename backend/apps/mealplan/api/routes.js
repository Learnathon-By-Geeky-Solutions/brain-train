import express from 'express';
import { validateMealPlanRequest } from './../middleware/validator.js';
import {
  planMeal
} from './controller.js';

const router = express.Router();

router.post('/generate',validateMealPlanRequest, planMeal);


export default router;
