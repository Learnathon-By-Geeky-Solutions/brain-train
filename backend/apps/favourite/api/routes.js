import express from "express";
import {
  favouriteRecipesFinder,
  favouriteRecipesAdder,
  favouriteRecipesRemover,
} from "./controller.js";
import {
  validateAddRecipe,
  validateRemoveRecipe,
} from "../middleware/validators.js";

const router = express.Router();

/**
 * @swagger
 * /favourites/list:
 *   get:
 *     summary: Get user's favourite recipes
 *     description: Returns a list of all recipes that the authenticated user has added to their favourites.
 *     tags:
 *       - Favourites
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favourite recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/list", favouriteRecipesFinder);

/**
 * @swagger
 * /favourites/addRecipe:
 *   post:
 *     summary: Add a recipe to user's favourites
 *     description: Adds the specified recipe to the user's favourites list.
 *     tags:
 *       - Favourites
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Recipe added to favourites
 *       400:
 *         description: Invalid recipe ID
 *       404:
 *         description: Recipe not found
 *       409:
 *         description: Recipe already in favourites
 *       500:
 *         description: Internal server error
 */
router.post("/addRecipe", validateAddRecipe, favouriteRecipesAdder);

/**
 * @swagger
 * /favourites/removeRecipe:
 *   delete:
 *     summary: Remove a recipe from user's favourites
 *     description: Removes the specified recipe from the user's favourites list.
 *     tags:
 *       - Favourites
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Recipe removed from favourites
 *       400:
 *         description: Invalid recipe ID
 *       404:
 *         description: Recipe not in favourites
 *       500:
 *         description: Internal server error
 */
router.delete("/removeRecipe", validateRemoveRecipe, favouriteRecipesRemover);

export default router;
