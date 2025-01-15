import express from "express"; // Core framework for Node.js
import bodyParser from "body-parser"; // Middleware for parsing request bodies
import cookieParser from "cookie-parser"; // Middleware for parsing cookies
import cors from "cors"; // Middleware for enabling CORS (Cross-Origin Resource Sharing)
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Database driver for MongoDB

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies in incoming requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors(
  {
      origin: '*',
      methods: "GET,POST,PUT,DELETE,PATCH",
      credentials: true,
      maxAge: 36000,
  }
));

// // Database connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch(err => console.error("Failed to connect to MongoDB:", err));

// // Routes
// import signinRoutes from './apps/signin/api/routes.js';
// app.use("/signin", signinRoutes);

import spoonacularRoutes from './apps/spoonacular/api/routes.js';

app.use('/search', spoonacularRoutes);


// Catch-all route for unmatched requests
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
