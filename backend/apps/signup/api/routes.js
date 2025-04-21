import express from "express";
import { signupController } from "./controller.js";

const router = express.Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user with Firebase ID token
 *     description: |
 *       Decodes the Firebase ID token from the Authorization header, and creates a new user using the provided name and email.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Firebase ID token in the format `Bearer <token>`
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created
 *       500:
 *         description: Server error during user creation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.post("/", signupController);

export default router;
