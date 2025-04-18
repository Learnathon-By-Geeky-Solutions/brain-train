import request from "supertest";
import app from "../../../app.js";

describe("GET /favourites/list", () => {
  it("should return a list of favourite recipes with valid fields", async () => {
    const response = await request(app)
      .get("/favourites/list")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("recipes");
    expect(Array.isArray(response.body.recipes)).toBe(true);

    response.body.recipes.forEach((recipe) => {
      expect(recipe).toHaveProperty("id");
      expect(recipe).toHaveProperty("title");
      expect(recipe).toHaveProperty("image");
      expect(recipe).toHaveProperty("likes");
    });
  });
});
