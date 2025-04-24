import request from "supertest";
import app from "../../../app.js";

describe("GET /plan/view", () => {
  const authHeader = { Authorization: `Bearer ${global.__TEST_TOKEN__}` };

  it("should return both daily and weekly plans", async () => {
    const res = await request(app).get("/plan/view").set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("dailyPlans");
    expect(res.body).toHaveProperty("weeklyPlans");
    expect(Array.isArray(res.body.dailyPlans)).toBe(true);
    expect(Array.isArray(res.body.weeklyPlans)).toBe(true);
  });

  it("should return only daily plans when type=day", async () => {
    const res = await request(app).get("/plan/view?type=day").set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("dailyPlans");
    expect(Array.isArray(res.body.dailyPlans)).toBe(true);
    expect(res.body).not.toHaveProperty("weeklyPlans");
  });

  it("should return only weekly plans when type=week", async () => {
    const res = await request(app).get("/plan/view?type=week").set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("weeklyPlans");
    expect(Array.isArray(res.body.weeklyPlans)).toBe(true);
    expect(res.body).not.toHaveProperty("dailyPlans");
  });

  it("should return 500 if no auth token is provided", async () => {
    const res = await request(app).get("/plan/view");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("success", false);
  });
});
