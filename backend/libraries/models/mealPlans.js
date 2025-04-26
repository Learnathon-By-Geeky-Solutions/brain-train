import mongoose from "mongoose";
/**
 * @swagger
 * components:
 *   schemas:
 *     Meal:
 *       type: object
 *       properties:
 *         sourceId:
 *           type: string
 *           description: The source ID of the meal.
 *         recipeId:
 *           type: string
 *           description: The recipe ID of the meal.
 *         image:
 *           type: string
 *           description: The image URL of the meal.
 *         imageType:
 *           type: string
 *           description: The type of the image.
 *         title:
 *           type: string
 *           description: The title of the meal.
 *         readyInMinutes:
 *           type: integer
 *           description: The time required to prepare the meal in minutes.
 *         servings:
 *           type: integer
 *           description: The number of servings for the meal.
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
 *           description: The unit of the nutrient amount.
 *     MealPlan:
 *       type: object
 *       properties:
 *         meals:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Meal'
 *         nutrients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Nutrient'
 *     DailyMealPlan:
 *       type: object
 *       properties:
 *         firebaseUid:
 *           type: string
 *           description: The Firebase UID of the user.
 *         dailyMealPlans:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the daily meal plan.
 *               mealPlan:
 *                 $ref: '#/components/schemas/MealPlan'
 *               savedAt:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time when the meal plan was saved.
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: The start date of the meal plan.
 *     WeeklyMealPlan:
 *       type: object
 *       properties:
 *         firebaseUid:
 *           type: string
 *           description: The Firebase UID of the user.
 *         weeklyMealPlans:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the weekly meal plan.
 *               dailyMealPlans:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       description: The title of the daily meal plan.
 *                     mealPlan:
 *                       $ref: '#/components/schemas/MealPlan'
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                       description: The start date of the daily meal plan.
 *                     savedAt:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the daily meal plan was saved.
 *               savedAt:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time when the weekly meal plan was saved.
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: The start date of the weekly meal plan.
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: The end date of the weekly meal plan.
 */
const mealSchema = new mongoose.Schema({
  sourceId: {
    type: String,
    required: true,
    // unique: true
  },
  recipeId: {
    type: String,
    required: true,
    // unique: true
  },
  image: {
    type: String,
    default: "",
  },
  imageType: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  readyInMinutes: {
    type: Number,
    default: 0,
  },
  servings: {
    type: Number,
    default: 0,
  },
});

const mealPlanSchema = new mongoose.Schema({
  meals: [mealSchema],
  nutrients: [
    {
      name: {
        type: String,
        //required: true
      },
      amount: {
        type: Number,
        default: 0,
      },
      unit: {
        type: String,
        default: "",
      },
    },
  ],
});

const dailyMealSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
  },
  dailyMealPlans: [
    {
      title: {
        type: String,
        default: "Daily Meal Plan#",
      },
      mealPlan: mealPlanSchema,
      savedAt: {
        type: Date,
        default: Date.now,
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const weeklyPlanSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
  },
  weeklyMealPlans: [
    {
      title: {
        type: String,
        default: "Weekly Meal Plan#",
      },
      // dailyMealPlans: [mealPlanSchema],
      dailyMealPlans: [
        {
          title: {
            type: String,
            default: "Daily Meal Plan#",
          },
          mealPlan: mealPlanSchema,
          startDate: {
            type: Date,
            default: Date.now,
          },
          savedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      savedAt: {
        type: Date,
        default: Date.now,
      },
      startDate: {
        type: Date,
        //required: true,
        default: Date.now,
      },
      endDate: {
        type: Date,
        //required: true
      },
    },
  ],
});

dailyMealSchema.index({ firebaseUid: 1 });
weeklyPlanSchema.index({ firebaseUid: 1 });

const DailyMealPlan = mongoose.model("DailyMealPlan", dailyMealSchema);
const WeeklyMealPlan = mongoose.model("WeeklyMealPlan", weeklyPlanSchema);

export { DailyMealPlan, WeeklyMealPlan };
