import express from "express";
import { signinController } from "./controller.js";

const router = express.Router();

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Sign in a user with Firebase ID token
 *     description: |
 *       Accepts a Firebase ID token from the Authorization header, verifies it,
 *       checks if the user exists in the database, and either logs them in or creates a new user.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example: {}
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Firebase ID token in the format `Bearer <token>`
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 username:
 *                   type: string
 *                   example: johndoe
 *       201:
 *         description: User created and logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 username:
 *                   type: string
 *                   example: janedoe
 *       401:
 *         description: Unauthorized - Invalid or missing Firebase token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.post("/", signinController);

export default router;
