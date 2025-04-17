import express from 'express';
import { upload,handleMulterErrors } from '../middleware/multerUpload.js';
import { validateImageUpload } from '../middleware/validateUpload.js';
import { analyzeImageIngredients } from './controller.js';

const router = express.Router();


router.post(
    '/analyze/ingredients',
    handleMulterErrors(upload.single('image')),
    validateImageUpload,
    analyzeImageIngredients
);



export default router;
