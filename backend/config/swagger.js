import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Geeky Chef API Documentation",
      version: "2.0.0",
      description: "API docs for the Geeky Chef backend, made with Swagger",
      contact: {
        name: "Geeky Chef by Team brain-train",
        url: "https://github.com/Learnathon-By-Geeky-Solutions/brain-train",
      },
    },
    servers: [
      {
        url: "http://localhost:8000/",
      },
    ],
  },
  apis: ["./apps/**/api/routes.js", "./apps/**/api/controller.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
