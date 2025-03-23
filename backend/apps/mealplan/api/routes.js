import express from 'express';
import {
  planMeal
} from './controller.js';

const router = express.Router();

router.get('/', planMeal);


export default router;
