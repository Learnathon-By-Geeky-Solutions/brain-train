import express from 'express';
import { usernameValidator } from './controller.js';

const router = express.Router();

router.post('/checkUsername', usernameValidator);

export default router;