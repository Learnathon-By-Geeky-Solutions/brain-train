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

router.post("/generate", validateMealPlanRequest, planMeal);
router.get("/view", viewMealPlans);
router.get("/view/:planId", viewMealPlanById);

router.delete("/all", deleteAllMealPlans);
router.delete("/:planId", deleteMealPlanById);

router.get("/search", searchMealPlanByDate);

export default router;
