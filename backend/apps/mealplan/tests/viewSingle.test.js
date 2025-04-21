import request from "supertest";
import mongoose from "mongoose";

import app from "../../../app.js";

function formatDate(date) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

describe("Create & View Specific Daily Plan", () => {
  const authHeader = { Authorization: `Bearer ${global.__TEST_TOKEN__}` };
  let createdPlanId;

  it("should retrieve the created plan using /plan/view/:id?type=week", async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 300);
    const futureDate = formatDate(startDate);

    const res1 = await request(app)
      .post("/plan/generate")
      .set(authHeader)
      .send({
        timeFrame: "week",
        startDate: futureDate,
        targetCalories: 1800,
        exclude: "pork",
        title: "Test Plan with deleteOverlap",
        deleteOverlap: true,
      });

    expect([200, 201]).toContain(res1.status);
    expect(res1.body).toHaveProperty("success", true);
    expect(res1.body).toHaveProperty("plan._id");
    createdPlanId = res1.body.plan._id;
    const res = await request(app)
      .get(`/plan/view/${createdPlanId}?type=week`)
      .set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("plan");
    expect(res.body.plan._id).toBe(createdPlanId);
  });

  it("should retrieve the created plan using /plan/view/:id?type=day", async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 3);
    const futureDate = formatDate(startDate);
    const res1 = await request(app)
      .post("/plan/generate")
      .set(authHeader)
      .send({
        timeFrame: "day",
        startDate: futureDate,
        targetCalories: 1800,
        exclude: "pork",
        title: "Test Plan with deleteOverlap",
        deleteOverlap: true,
      });

    expect([200, 201]).toContain(res1.status);
    expect(res1.body).toHaveProperty("success", true);
    expect(res1.body).toHaveProperty("plan._id");
    createdPlanId = res1.body.plan._id;
    const res = await request(app)
      .get(`/plan/view/${createdPlanId}?type=day`)
      .set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("plan");
    expect(res.body.plan._id).toBe(createdPlanId);
    expect(res.body.plan).toHaveProperty("dailyMealPlans");
    expect(Array.isArray(res.body.plan.dailyMealPlans)).toBe(true);
    expect(res.body.plan.dailyMealPlans.length).toBeGreaterThan(0);

    expect(res.body.plan.dailyMealPlans[0]).toHaveProperty("mealPlan");
    expect(res.body.plan.dailyMealPlans[0].mealPlan).toHaveProperty("meals");
    const meals = res.body.plan.dailyMealPlans[0].mealPlan.meals;
    expect(Array.isArray(meals)).toBe(true);
    expect(meals.length).toBeGreaterThan(0);
  });
  it("unauthenticated user should not be able to view a plan", async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 300);
    const futureDate = formatDate(startDate);

    const res1 = await request(app)
      .post("/plan/generate")
      .set(authHeader)
      .send({
        timeFrame: "day",
        startDate: futureDate,
        targetCalories: 1800,
        exclude: "pork",
        title: "Test Plan with deleteOverlap",
        deleteOverlap: true,
      });

    expect([200, 201]).toContain(res1.status);
    expect(res1.body).toHaveProperty("success", true);
    expect(res1.body).toHaveProperty("plan._id");
    createdPlanId = res1.body.plan._id;
    const res = await request(app).get(`/plan/view/${createdPlanId}?type=day`);
    expect(res.status).toBe(500);
  });
  it("should not retrieve for invalid type: the created plan using /plan/view/:id?type=month", async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 3);
    const futureDate = formatDate(startDate);
    const res1 = await request(app)
      .post("/plan/generate")
      .set(authHeader)
      .send({
        timeFrame: "day",
        startDate: futureDate,
        targetCalories: 1800,
        exclude: "pork",
        title: "Test Plan with deleteOverlap",
        deleteOverlap: true,
      });

    expect([200, 201]).toContain(res1.status);
    expect(res1.body).toHaveProperty("success", true);
    expect(res1.body).toHaveProperty("plan._id");
    createdPlanId = res1.body.plan._id;
    const res = await request(app)
      .get(`/plan/view/${createdPlanId}?type=month`)
      .set(authHeader);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("success", false);
  });
  it("random mongoose id should not retrieve a plan", async () => {
    const randomId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/plan/view/${randomId}?type=day`)
      .set(authHeader);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Meal plan not found.");
  });
});
