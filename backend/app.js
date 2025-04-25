import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { swaggerUi, swaggerSpec } from "./config/swagger.js";

import setupMiddlewares from "./config/middleware.js";

// Routes
import signinRoute from "./apps/signin/api/routes.js";
import signupRoute from "./apps/signup/api/routes.js";
import searchRoutes from "./apps/search/api/routes.js";
import planRoutes from "./apps/mealplan/api/routes.js";
import userRoutes from "./apps/user/api/routes.js";
import favouritesRoutes from "./apps/favourite/api/routes.js";
import trendingRoutes from "./apps/trending/api/routes.js";
import aiRoutes from "./apps/ai-assistance/api/routes.js";

dotenv.config();

const app = express();

setupMiddlewares(app);

// Database connection
mongoose.connect(process.env.MONGODB_URI);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/signin", signinRoute);
app.use("/signup", signupRoute);
app.use("/search", searchRoutes);
app.use("/plan", planRoutes);
app.use("/user", userRoutes);
app.use("/favourites", favouritesRoutes);
app.use("/trending", trendingRoutes);
app.use("/ai", aiRoutes);

// Catch-all route
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
