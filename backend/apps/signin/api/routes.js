import express from 'express';
import { signinController } from '../api/controller.js';

const router = express.Router();

router.post('/', signinController);

export default router;
