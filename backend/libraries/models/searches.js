/**
 * @swagger
 * components:
 *   schemas:
 *     Search:
 *       type: object
 *       properties:
 *         recipeId:
 *           type: string
 *           description: The ID of the recipe being searched.
 *         searchedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the search was performed.
 *       required:
 *         - recipeId
 */

import mongoose from "mongoose";

const searchSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: true,
  },
  searchedAt: {
    type: Date,
    default: Date.now(),
  },
});

export default searchSchema;
