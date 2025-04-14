import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Geeky Chef API Documentation",
      version: "2.0.0",
      description: "API docs for the Geeky Chef backend.",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
  },
  apis: [
    "./apps/**/api/routes.js",
    "./apps/**/api/controller.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };