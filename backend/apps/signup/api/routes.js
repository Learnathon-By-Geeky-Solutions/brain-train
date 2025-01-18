import express from 'express';
import { signupController } from '../api/controller.js';

const router = express.Router();

router.post('/', signupController);

export default router;