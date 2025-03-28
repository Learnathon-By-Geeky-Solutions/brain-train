import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes
import signinRoute from "./apps/signin/api/routes.js";
import signupRoute from "./apps/signup/api/routes.js";
import searchRoutes from "./apps/search/api/routes.js";
import planRoutes from "./apps/mealplan/api/routes.js";
import userRoutes from "./apps/user/api/routes.js";
import favouritesRoutes from "./apps/favourite/api/routes.js";

dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:5173"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  maxAge: 3600,
};

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

app.use("/signin", signinRoute);
app.use("/signup", signupRoute);
app.use("/search", searchRoutes);
app.use("/plan", planRoutes);
app.use("/user", userRoutes);
app.use("/favourites", favouritesRoutes);

// Catch-all route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
