import express from "express"; // Core framework for Node.js
import cookieParser from "cookie-parser"; // Middleware for parsing cookies
import cors from "cors"; // Middleware for enabling CORS (Cross-Origin Resource Sharing)
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Database driver for MongoDB

// Routes
import signinRoute from './apps/signin/api/routes.js';
import signupRoute from './apps/signup/api/routes.js';
import searchRoutes from './apps/search/api/routes.js';
import userRoutes from './apps/user/api/routes.js';
import favouritesRoutes from './apps/favourite/api/routes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173'
]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow if in the list
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true, // Allow authentication (JWT, cookies, etc.)
  maxAge: 3600,
};

// Middleware
app.use(helmet());
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies in incoming requests
app.use(cors(corsOptions));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB:", err));

app.use("/signin", signinRoute);
app.use("/signup", signupRoute);
app.use('/search', searchRoutes);
app.use('/user', userRoutes);
app.use('/favourites', favouritesRoutes);

// Catch-all route for unmatched requests
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
