import request from "supertest";
import app from "../../../app.js";

function formatDate(date) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

describe("DELETE /plan/all", () => {
  const authHeader = {
    Authorization: `Bearer ${global.__DISPOSABLE_USER_TOKEN__}`,
  };
  let dailyDate = new Date();
  dailyDate.setDate(dailyDate.getDate() + 3); // 3 days from now
  let weeklyDate = new Date();
  weeklyDate.setDate(weeklyDate.getDate() + 40); // 4 days from now

  beforeAll(async () => {
    // Create a daily plan
    await request(app)
      .post("/plan/generate")
      .set(authHeader)
      .send({
        title: "Temp Daily Plan",
        timeFrame: "day",
        startDate: formatDate(dailyDate),
        targetCalories: 2000,
        exclude: "chicken",
        deleteOverlap: true,
      });

    // Create a weekly plan
    await request(app)
      .post("/plan/generate")
      .set(authHeader)
      .send({
        title: "Temp Weekly Plan",
        timeFrame: "week",
        startDate: formatDate(weeklyDate),
        targetCalories: 2200,
        exclude: "pork",
        deleteOverlap: true,
      });
  });

  it("should delete all plans for the user", async () => {
    const res = await request(app).delete("/plan/all").set(authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      message: "All meal plans deleted.",
    });
  });

  it("should return 500 if no token provided", async () => {
    const res = await request(app).delete("/plan/all");
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("success", false);
  });
});
