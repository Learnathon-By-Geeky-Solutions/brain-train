import express from 'express';
import multer from 'multer';
import { analyzeImageIngredients } from './controller.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post('/analyze', upload.single('image'), analyzeImageIngredients);
export default router;
