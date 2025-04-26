import request from "supertest";
import app from "./app.js";
import dotenv from "dotenv";
import { jest } from "@jest/globals";

dotenv.config = jest.fn();

describe("App.js - Route setup & middlewares", () => {
  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/unknown");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Route not found");
  });

  it("should have helmet headers set", async () => {
    const res = await request(app).get("/unknown");
    expect(res.headers["x-dns-prefetch-control"]).toBe("off");
  });

  it("should respond to a valid route", async () => {
    const res = await request(app)
      .post("/signin")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);
    expect([200, 400, 401]).toContain(res.status);
  });

  it("should allow requests from allowed origin", async () => {
    const res = await request(app)
      .get("/signin")
      .set("Origin", "http://localhost:5173");
    expect(res.statusCode).not.toBe(403);
  });

  it("should reject requests from disallowed origin", async () => {
    const res = await request(app)
      .get("/some-valid-route")
      .set("Origin", "http://evil.com");

    // CORS errors don't always manifest as status codes unless manually handled,
    // but you can check response headers:
    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });
});

describe("Swagger configuration", () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("should use FRONTEND_URL and BACKEND_URL from environment variables when set", async () => {
    process.env.FRONTEND_URL = "http://frontend.example.com";
    process.env.BACKEND_URL = "http://backend.example.com";

    const { getSwaggerSpec } = await import("./config/swagger.js");
    const swaggerSpec = getSwaggerSpec();

    expect(swaggerSpec.info.contact.url).toBe("http://frontend.example.com");
    expect(swaggerSpec.servers[0].url).toBe("http://backend.example.com");
  });

  it("should fall back to default values when FRONTEND_URL and BACKEND_URL are not set", async () => {
    delete process.env.FRONTEND_URL;
    delete process.env.BACKEND_URL;

    const { getSwaggerSpec } = await import("./config/swagger.js");
    const swaggerSpec = getSwaggerSpec();

    expect(swaggerSpec.info.contact.url).toBe("http://localhost:5173");
    expect(swaggerSpec.servers[0].url).toBe("http://localhost:8000");
  });

  it("should use fallback for one missing env var", async () => {
    process.env.BACKEND_URL = "http://backend.example.com";
    delete process.env.FRONTEND_URL;

    const { getSwaggerSpec } = await import("./config/swagger.js");
    const swaggerSpec1 = getSwaggerSpec();

    expect(swaggerSpec1.info.contact.url).toBe("http://localhost:5173");
    expect(swaggerSpec1.servers[0].url).toBe("http://backend.example.com");

    process.env.FRONTEND_URL = "http://frontend.example.com";
    delete process.env.BACKEND_URL;

    const swaggerSpec2 = getSwaggerSpec();

    expect(swaggerSpec2.info.contact.url).toBe("http://frontend.example.com");
    expect(swaggerSpec2.servers[0].url).toBe("http://localhost:8000");
  });
});
