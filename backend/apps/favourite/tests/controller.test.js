import request from "supertest";
import app from "../../../app.js";
import { favouriteRecipeList } from "./mock.js";

describe("GET /favourites/list", () => {
  it("should return a valid list of favourite recipes", async () => {
    const response = await request(app)
      .get("/favourites/list")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("recipes");
    expect(Array.isArray(response.body.recipes)).toBe(true);

    response.body.recipes.forEach((recipe, index) => {
      const expectedRecipe = favouriteRecipeList[index];

      expect(recipe.id).toBe(expectedRecipe.id);
      expect(recipe.title).toBe(expectedRecipe.title);
      expect(recipe.image).toBe(expectedRecipe.image);
      expect(recipe.likes).toBe(expectedRecipe.likes);
    });
  });
});
