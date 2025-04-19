import request from "supertest";
import app from "../../../app.js";

describe("Favourites Error Cases", () => {
  const invalidId = "123-invalid";
  const nonExistentId = "609e1263fc13ae1abf000000";

  it("should return 400 for invalid recipeId in addRecipe", async () => {
    const response = await request(app)
      .post("/favourites/addRecipe")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .send({ recipeId: invalidId });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid recipe ID");
  });

  it("should return 400 for invalid recipeId in removeRecipe", async () => {
    const response = await request(app)
      .delete("/favourites/removeRecipe")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .send({ recipeId: invalidId });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid recipe ID");
  });

  it("should return 404 when adding a recipe that doesn't exist", async () => {
    const response = await request(app)
      .post("/favourites/addRecipe")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .send({ recipeId: nonExistentId });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Recipe not found");
  });
});
