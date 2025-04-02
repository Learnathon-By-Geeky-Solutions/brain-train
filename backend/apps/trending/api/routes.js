import express from "express";
import { getTrendingRecipes } from "./controller.js";

const router = express.Router();

router.get("/:n", getTrendingRecipes);

export default router;
