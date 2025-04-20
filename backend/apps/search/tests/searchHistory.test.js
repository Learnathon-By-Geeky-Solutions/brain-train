import request from "supertest";
import app from "../../../app.js";

describe("Search History Endpoint Test", () => {
  const endpoint = "/search/history";

  it("should return 400 for invalid query", async () => {
    const response = await request(app).get(`${endpoint}/abc`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid history query.");
  });

  it("should return 400 for negative recipe query", async () => {
    const n = -3;
    const response = await request(app).get(`${endpoint}/${n}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid history query.");
  });

  it("should return 400 for zero recipe query", async () => {
    const n = 0;
    const response = await request(app).get(`${endpoint}/${n}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid history query.");
  });

  it("should return 500 when accessed with authentification", async () => {
    const n = 6;
    const response = await request(app).get(`${endpoint}/${n}`);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 200 with empty history for a new user", async () => {
    const n = 4;
    const response = await request(app)
      .get(`${endpoint}/${n}`)
      .set("Authorization", `Bearer ${global.__DISPOSABLE_USER_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(response.body.results).toHaveLength(0);
  });

  it("should return 200 with history full of unique recipes for a user with non empty history", async () => {
    const n = 8;
    const response = await request(app)
      .get(`${endpoint}/${n}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
    expect(Array.isArray(response.body.results)).toBe(true);

    const history = response.body.results;

    expect(history.length).toBeGreaterThan(0);
    expect(history.length).toBeLessThanOrEqual(n);

    history.forEach((recipe) => {
      expect(recipe).toHaveProperty("id");
      expect(recipe).toHaveProperty("title");
      expect(recipe).toHaveProperty("image");
      expect(recipe).toHaveProperty("likes");
      expect(recipe).toHaveProperty("summary");
    });
  });
});
