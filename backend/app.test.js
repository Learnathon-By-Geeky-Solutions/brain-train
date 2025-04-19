import request from "supertest";
import app from "./app.js";

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
