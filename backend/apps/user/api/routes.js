import express from 'express';
import { usernameValidator } from './controller.js';

/**
 * USER AUTHENTICATION ROUTER
 * HANDLES USERNAME VALIDATION ENDPOINTS
 */
const router = express.Router();

router.post('/checkUsername', usernameValidator);

export default router;