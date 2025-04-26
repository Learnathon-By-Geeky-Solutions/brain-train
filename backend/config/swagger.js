import dotenv from "dotenv";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Load environment variables
dotenv.config();

const getSwaggerSpec = () => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Geeky Chef API Documentation",
        version: "2.0.0",
        description: "API docs for the Geeky Chef backend, made with Swagger",
        contact: {
          name: "Geeky Chef by Team brain-train",
          url: process.env.FRONTEND_URL || "http://localhost:5173",
        },
      },
      servers: [
        {
          url: process.env.BACKEND_URL || "http://localhost:8000",
          description: "Backend server",
        },
      ],
    },
    apis: ["./apps/**/api/routes.js", "./libraries/models/*.js"],
  };

  return swaggerJsdoc(options);
};

export { swaggerUi, getSwaggerSpec };
