import dotenv from "dotenv";

dotenv.config();

const allowedOrigins = [process.env.FRONTEND_URL];

const isOriginAllowed = (origin) => !origin || allowedOrigins.includes(origin);

export const corsOptions = {
  origin: (origin, callback) =>
    isOriginAllowed(origin)
      ? callback(null, true)
      : callback(new Error("Not allowed by CORS")),
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  maxAge: 3600,
};
