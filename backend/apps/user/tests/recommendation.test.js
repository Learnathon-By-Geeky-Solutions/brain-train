import request from "supertest";
import app from "../../../app.js";

describe("Recommendation Test", () => {
  const endpoint = "/user/recommended";

  it("should return 200 with a list of recipes for an user with non empty search history", async () => {
    const response = await request(app)
      .get(`${endpoint}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
    expect(Array.isArray(response.body.results)).toBe(true);

    const recommendations = response.body.results;
    expect(recommendations).toHaveLength(10); // RECOMMENDATION_LIMIT

    recommendations.forEach((recipe) => {
      expect(recipe).toHaveProperty("id");
      expect(recipe).toHaveProperty("title");
      expect(recipe).toHaveProperty("image");
      expect(recipe).toHaveProperty("likes");
      expect(recipe).toHaveProperty("summary");
    });
  });

  it("should return 200 with an empty list for an user with empty search history", async () => {
    const response = await request(app)
      .get(`${endpoint}`)
      .set("Authorization", `Bearer ${global.__DISPOSABLE_USER_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(response.body.results).toHaveLength(0);
  });
});
