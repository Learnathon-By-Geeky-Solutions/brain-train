import express from "express";
import { signupController } from "./controller.js";

const router = express.Router();

router.post("/", signupController);

export default router;
