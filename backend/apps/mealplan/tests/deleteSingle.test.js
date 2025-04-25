import request from "supertest";
import app from "../../../app.js";
import mongoose from "mongoose";

const formatDate = (date) => date.toISOString().split("T")[0];
const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

describe("DELETE /plan/:id?type=...", () => {
  let dailyPlanId;
  let weeklyPlanId;

  const authHeader = {
    Authorization: `Bearer ${global.__DISPOSABLE_USER_TOKEN__}`,
  };

  beforeAll(async () => {
    // Create a daily plan
    const dailyRes = await request(app)
      .post("/plan/generate")
      .set(authHeader)
      .send({
        title: "Daily Plan To Delete",
        timeFrame: "day",
        startDate: addDays(3),
        targetCalories: 2200,
        exclude: "",
        deleteOverlap: true,
      });
    dailyPlanId = dailyRes.body.plan._id;

    // Create a weekly plan
    const weeklyRes = await request(app)
      .post("/plan/generate")
      .set(authHeader)
      .send({
        title: "Weekly Plan To Delete",
        timeFrame: "week",
        startDate: addDays(4),
        targetCalories: 2000,
        exclude: "",
        deleteOverlap: true,
      });
    weeklyPlanId = weeklyRes.body.plan._id;
  });

  it("should delete daily plan successfully", async () => {
    const res = await request(app)
      .delete(`/plan/${dailyPlanId}?type=day`)
      .set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Meal plan deleted.",
    });
  });

  it("should delete weekly plan successfully", async () => {
    const res = await request(app)
      .delete(`/plan/${weeklyPlanId}?type=week`)
      .set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "Meal plan deleted.",
    });
  });

  it("should return 400 if type is missing", async () => {
    const res = await request(app)
      .delete(`/plan/${weeklyPlanId}`)
      .set(authHeader);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("success", false);
  });

  it("should return 404 for non-existing daily plan", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/plan/${fakeId}?type=day`)
      .set(authHeader);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("success", false);
  });

  it("should return 404 for non-existing weekly plan", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/plan/${fakeId}?type=week`)
      .set(authHeader);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("success", false);
  });

  it("should return 500 for malformed plan ID", async () => {
    const res = await request(app)
      .delete(`/plan/not-a-valid-id?type=week`)
      .set(authHeader);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("success", false);
  });

  it("should return 500 without authentication token", async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/plan/${id}?type=week`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("success", false);
  });
});
