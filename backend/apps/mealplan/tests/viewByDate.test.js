import request from "supertest";
import app from "../../../app.js";

// Reusable utility to format YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

const baseUrl = "/plan/search";
let startDate = new Date();
startDate.setDate(startDate.getDate() + 1); // 3 days from now
const validDay = formatDate(startDate); // Same as your sample
startDate.setDate(startDate.getDate() + 4); // 7 days from now
const validWeek = formatDate(startDate); // A week range test
const invalidType = "monthly";

describe("GET /plan/search", () => {
  beforeAll(async () => {
    await request(app)
      .post("/plan/generate")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`) // if auth is required
      .send({
        title: "Temp Daily Plan",
        timeFrame: "day",
        startDate: validDay,
        targetCalories: 2000,
        exclude: "chicken",
        deleteOverlap: true,
      });

    // Create a weekly plan
    await request(app)
      .post("/plan/generate")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`) // if auth is required
      .send({
        title: "Temp Weekly Plan",
        timeFrame: "week",
        startDate: validWeek,
        targetCalories: 2200,
        exclude: "pork",
        deleteOverlap: true,
      });
  });

  it("should return 200 and daily plan for type=day", () => {
    return request(app)
      .get(`${baseUrl}?date=${validDay}&type=day`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
        expect(Array.isArray(res.body.plans)).toBe(true);
      });
  });
  it("should return 200 and daily plan for type=day,returns part of weekly plan", () => {
    startDate.setDate(startDate.getDate() + 6);
    let testDate = formatDate(startDate); // A week range test
    return request(app)
      .get(`${baseUrl}?date=${testDate}&type=day`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
        expect(Array.isArray(res.body.plans)).toBe(true);
      });
  });

  it("should return 200 and weekly plan for type=week", () => {
    return request(app)
      .get(`${baseUrl}?date=${validDay}&type=week`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
        expect(typeof res.body.plans).toBe("object"); // { monday: ..., tuesday: ..., etc. }
      });
  });
  it("should return 200 and weekly plan for type=week,full week", () => {
    return request(app)
      .get(`${baseUrl}?date=${validWeek}&type=week`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
        expect(typeof res.body.plans).toBe("object"); // { monday: ..., tuesday: ..., etc. }
      });
  });

  it("should return 400 if date is missing", () => {
    return request(app)
      .get(`${baseUrl}?type=day`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("success", false);
      });
  });

  it("should return 400 if type is missing", () => {
    return request(app)
      .get(`${baseUrl}?date=${validDay}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("success", false);
      });
  });

  it("should return 400 for invalid type", () => {
    return request(app)
      .get(`${baseUrl}?date=${validDay}&type=${invalidType}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("success", false);
      });
  });

  it("should return 401/500 if token is missing", () => {
    return request(app)
      .get(`${baseUrl}?date=${validDay}&type=day`)
      .then((res) => {
        expect([401, 500]).toContain(res.status);
        expect(res.body).toHaveProperty("success", false);
      });
  });
});
