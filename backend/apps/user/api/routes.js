import express from "express";
import { usernameValidator, recipeRecommender } from "./controller.js";

/**
 * USER AUTHENTICATION ROUTER
 * HANDLES USERNAME VALIDATION ENDPOINTS
 */
const router = express.Router();

/**
 * @swagger
 * /user/checkUsername:
 *   post:
 *     summary: Validate and check availability of a username
 *     description: |
 *       Checks if the provided username is in a valid format and whether it is available (not already taken).
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *     responses:
 *       200:
 *         description: Username is valid and available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username available
 *                 available:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid username format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid username format
 *                 available:
 *                   type: boolean
 *                   example: false
 *       409:
 *         description: Username already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Username already exists
 *                 available:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Server error during validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */

router.post("/checkUsername", usernameValidator);
router.get("/recommended", recipeRecommender);

export default router;
