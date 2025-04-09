import express from 'express';
import { validateMealPlanRequest } from './../middleware/validator.js';
import {
  planMeal,
  viewMealPlans,
  viewMealPlanById,
  deleteMealPlanById,
  deleteAllMealPlans
} from './controller.js';

const router = express.Router();

router.post('/generate',validateMealPlanRequest, planMeal);
router.get('/view',viewMealPlans);
router.get('/view/:planId', viewMealPlanById);

router.delete('/:planId', deleteMealPlanById); 
router.delete('all', deleteAllMealPlans);


export default router;
