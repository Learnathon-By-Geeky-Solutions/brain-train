import express from "express";
import { getTrendingRecipes } from "./controller.js";

const router = express.Router();

/**
 * @swagger
 * /trending/{n}:
 *   get:
 *     summary: Get top liked (trending) recipes
 *     description: Returns a list of the top `n` most liked recipes.
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: path
 *         name: n
 *         required: true
 *         schema:
 *           type: integer
 *         description: Number of top liked recipes to return
 *     responses:
 *       200:
 *         description: List of trending recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       image:
 *                         type: string
 *                       title:
 *                         type: string
 *                       likes:
 *                         type: integer
 *                       summary:
 *                         type: string
 *       400:
 *         description: Invalid query for trending recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.get("/:n", getTrendingRecipes);

export default router;
