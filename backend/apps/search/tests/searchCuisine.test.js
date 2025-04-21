import request from "supertest";
import app from "../../../app.js";

describe("Search By Cuisines Endpoint Test", () => {
  const endpoint = "/search/recipes/cuisines";

  it("should return 200 with recipes for an authenticated user,triggers db + api", async () => {
    const response = await request(app)
      .get(`${endpoint}?cuisine=African`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
    expect(Array.isArray(response.body.results)).toBe(true);

    const recipes = response.body.results;

    expect(recipes.length).toBeGreaterThan(0);
    expect(recipes[0]).toHaveProperty("id");
    expect(recipes[0]).toHaveProperty("image");
    expect(recipes[0]).toHaveProperty("title");
    expect(recipes[0]).toHaveProperty("likes");
    expect(recipes[0]).toHaveProperty("summary");
  });

  it("should return 200 with recipes for an authenticated user,triggers db only", async () => {
    const response = await request(app)
      .get(`${endpoint}?cuisine=Italian&number=10`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
    expect(Array.isArray(response.body.results)).toBe(true);

    const recipes = response.body.results;

    expect(recipes.length).toBeGreaterThan(0);
    expect(recipes[0]).toHaveProperty("id");
    expect(recipes[0]).toHaveProperty("image");
    expect(recipes[0]).toHaveProperty("title");
    expect(recipes[0]).toHaveProperty("likes");
    expect(recipes[0]).toHaveProperty("summary");
  });

  it("should return 400 with no cuisine", async () => {
    const response = await request(app)
      .get(`${endpoint}?number=10`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(400);
    const success = response.body.success;
    expect(success).toBe(false);
  });
});
