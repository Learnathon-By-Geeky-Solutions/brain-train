import request from "supertest";
import app from "../../../app.js";

it("should return 200 and valid shopping list for a dynamic recipe", async () => {
  // Step 1: Get recipe ID by searching
  const searchResponse = await request(app)
    .get("/search/recipes?ingredients=quail")
    .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

  expect(searchResponse.status).toBe(200);
  const recipes = searchResponse.body.results;
  expect(Array.isArray(recipes)).toBe(true);
  expect(recipes.length).toBeGreaterThan(0);

  const recipeId = recipes[0].id;

  // Step 2: Call shopping list endpoint using that recipeId
  const serving = 10;
  const shoppingListResponse = await request(app)
    .get(`/search/recipes/${recipeId}/shoppingList`)
    .query({ requestedServing: serving })
    .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

  expect(shoppingListResponse.status).toBe(200);
  const body = shoppingListResponse.body;

  expect(body).toHaveProperty("recipeId", recipeId);
  expect(body).toHaveProperty("servings", serving);
  expect(Array.isArray(body.shoppingList)).toBe(true);
  expect(body.shoppingList.length).toBeGreaterThan(0);

  // Validate structure of one ingredient
  const ingredient = body.shoppingList[0];
  expect(ingredient).toHaveProperty("title");
  expect(ingredient).toHaveProperty("unit");
  expect(ingredient).toHaveProperty("image");
  expect(ingredient).toHaveProperty("amount");
  expect(typeof ingredient.amount).toBe("number");
});
