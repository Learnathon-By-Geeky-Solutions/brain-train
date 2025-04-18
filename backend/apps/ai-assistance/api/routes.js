import express from 'express';
import { upload,handleMulterErrors } from '../middleware/multerUpload.js';
import { validateImageUpload } from '../middleware/validateUpload.js';
import { analyzeImageIngredients, analyzeImageRecipe , sendChatMessage } from './controller.js';

const router = express.Router();


router.post(
    '/analyze/ingredients',
    handleMulterErrors(upload.single('image')),
    validateImageUpload,
    analyzeImageIngredients
);

router.post(
    '/analyze/food',
    handleMulterErrors(upload.single('image')),
    validateImageUpload,
    analyzeImageRecipe
);

router.post(
    '/chat',
    handleMulterErrors(upload.single('image')),
    sendChatMessage
);




export default router;
