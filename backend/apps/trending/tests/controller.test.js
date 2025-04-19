import request from "supertest";
import app from "../../../app"; // adjust path if needed

describe("GET /trending/:n", () => {
  it("should return n trending recipes with required fields sorted by likes desc", async () => {
    const n = 5;
    const response = await request(app).get(`/trending/${n}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
    const recipes = response.body.results;

    expect(Array.isArray(recipes)).toBe(true);
    expect(recipes.length).toBeLessThanOrEqual(n);

    for (const recipe of recipes) {
      expect(recipe).toHaveProperty("id");
      expect(recipe).toHaveProperty("image");
      expect(recipe).toHaveProperty("title");
      expect(recipe).toHaveProperty("likes");
      expect(recipe).toHaveProperty("summary");
    }

    // Check sorting by likes descending
    const likesArray = recipes.map((r) => r.likes);
    const isSortedDesc = likesArray.every(
      (val, i, arr) => i === 0 || val <= arr[i - 1],
    );
    expect(isSortedDesc).toBe(true);
  });

  it("should return 400 for invalid query", async () => {
    const response = await request(app).get(`/trending/abc`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Invalid query for trending recipes.",
    );
  });

  it("should return 400 for negative recipe query", async () => {
    const n = -3;
    const response = await request(app).get(`/trending/${n}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Invalid query for trending recipes.",
    );
  });

  it("should return 400 for zero recipe query", async () => {
    const n = 0;
    const response = await request(app).get(`/trending/${n}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Invalid query for trending recipes.",
    );
  });
});
