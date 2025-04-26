/**
 * @swagger
 * components:
 *   schemas:
 *     Ingredient:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The name of the ingredient
 *         image:
 *           type: string
 *           description: URL of the ingredient's image
 *         amount:
 *           type: number
 *           description: The quantity of the ingredient
 *         unit:
 *           type: string
 *           description: The unit of measurement for the ingredient
 *         nutrients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Nutrient'
 *           description: List of nutrients associated with the ingredient
 *       required:
 *         - title
 *         - amount
 */
import mongoose from "mongoose";
import { nutrientSchema } from "./nutrition.js";

const ingredientSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  amount: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    default: "",
  },
  nutrients: [nutrientSchema],
});

export default ingredientSchema;
