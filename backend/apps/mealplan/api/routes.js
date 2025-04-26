import express from "express";
import { validateMealPlanRequest } from "./../middleware/validator.js";
import {
  planMeal,
  viewMealPlans,
  viewMealPlanById,
  deleteMealPlanById,
  deleteAllMealPlans,
  searchMealPlanByDate,
} from "./controller.js";

const router = express.Router();

/**
 * @swagger
 * /plan/generate:
 *   post:
 *     summary: Generate a personalized meal plan
 *     description: Creates a daily or weekly meal plan for the authenticated user. Handles overlapping plans and optional deletion.
 *     tags:
 *       - Meal Plans
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - timeFrame
 *               - startDate
 *               - targetCalories
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Weekly Fitness Plan"
 *               timeFrame:
 *                 type: string
 *                 enum: [day, week]
 *                 example: "week"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-28"
 *               targetCalories:
 *                 type: integer
 *                 example: 2000
 *               exclude:
 *                 type: string
 *                 description: Comma-separated ingredients to exclude
 *                 example: "chicken,pork"
 *               deleteOverlap:
 *                 type: boolean
 *                 description: Whether to delete overlapping plans if they exist
 *                 example: false
 *     responses:
 *       200:
 *         description: Meal plan generated successfully
 *       201:
 *         description: Meal plan created successfully
 *       400:
 *         description: Invalid input (e.g., date in the past)
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       409:
 *         description: Conflicting meal plan already exists
 *       500:
 *         description: Internal server error
 */
router.post("/generate", validateMealPlanRequest, planMeal);

/**
 * @swagger
 * /plan/view:
 *   get:
 *     summary: View user's meal plans
 *     description: Retrieves all daily and/or weekly meal plans associated with the authenticated user. Use the `type` query parameter to filter.
 *     tags:
 *       - Meal Plans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: type
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [day, week]
 *         description: Filter plans by type (daily or weekly)
 *     responses:
 *       200:
 *         description: Meal plans retrieved successfully
 *       400:
 *         description: Invalid type query
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/view", viewMealPlans);

/**
 * @swagger
 * /plan/view/{id}:
 *   get:
 *     summary: View a specific meal plan
 *     description: Retrieves the details of a specific meal plan by ID for a given time frame.
 *     tags:
 *       - Meal Plans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the meal plan
 *       - name: type
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum: [day, week]
 *         description: The type of view (day or week)
 *     responses:
 *       200:
 *         description: Meal plan retrieved successfully
 *       400:
 *         description: Invalid type parameter
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Meal plan not found
 *       500:
 *         description: Internal server error
 */
router.get("/view/:planId", viewMealPlanById);

/**
 * @swagger
 * /plan/all:
 *   delete:
 *     summary: Delete all meal plans for the authenticated user
 *     description: Deletes all daily and weekly meal plans belonging to the authenticated user.
 *     tags:
 *       - Meal Plans
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All meal plans deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: All meal plans deleted.
 *       500:
 *         description: Server error (e.g., missing authentication token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 */
router.delete("/all", deleteAllMealPlans);

/**
 * @swagger
 * /plan/{id}:
 *   delete:
 *     summary: Delete a specific meal plan
 *     description: Deletes a daily or weekly meal plan by its ID and type (either "day" or "week").
 *     tags:
 *       - Meal Plans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the meal plan to delete
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [day, week]
 *         description: Type of the meal plan
 *     responses:
 *       200:
 *         description: Meal plan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Meal plan deleted.
 *       400:
 *         description: Missing required query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Meal plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Server error (e.g., invalid ID format or missing token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 */
router.delete("/:planId", deleteMealPlanById);

/**
 * @swagger
 * /plan/search:
 *   get:
 *     summary: Search for a user's meal plan on a specific date
 *     description: Retrieves the meal plan(s) for a given date and type (`day` or `week`). Type must be specified. Auth is required.
 *     tags:
 *       - Meal Plans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: date
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format to search for plans
 *       - name: type
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum: [day, week]
 *         description: The type of plan to retrieve (daily or weekly)
 *     responses:
 *       200:
 *         description: Meal plans retrieved successfully
 *       400:
 *         description: Missing or invalid query parameters
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get("/search", searchMealPlanByDate);

export default router;
