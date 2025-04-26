import mongoose from "mongoose";
/**
 * @swagger
 * components:
 *   schemas:
 *     Nutrient:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the nutrient.
 *         amount:
 *           type: number
 *           description: The amount of the nutrient.
 *         unit:
 *           type: string
 *           description: The unit of measurement for the nutrient.
 *         percentOfDailyNeeds:
 *           type: number
 *           description: The percentage of daily needs for the nutrient.
 *       required:
 *         - name
 *         - amount
 *     NutritionProperty:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the nutrition property.
 *         amount:
 *           type: number
 *           description: The amount of the nutrition property.
 *         unit:
 *           type: string
 *           description: The unit of measurement for the nutrition property.
 *       required:
 *         - name
 *         - amount
 *     Nutrition:
 *       type: object
 *       properties:
 *         nutrients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Nutrient'
 *           description: A list of nutrients.
 *         properties:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/NutritionProperty'
 *           description: A list of nutrition properties.
 */
const nutrientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0.0,
  },
  unit: {
    type: String,
    default: "",
  },
  percentOfDailyNeeds: {
    type: Number,
    default: 0.0,
  },
});

const nutritionPropertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0.0,
  },
  unit: {
    type: String,
    default: "",
  },
});

const nutritionSchema = new mongoose.Schema({
  nutrients: [nutrientSchema],
  properties: [nutritionPropertySchema],
});

export { nutritionPropertySchema, nutrientSchema, nutritionSchema };
