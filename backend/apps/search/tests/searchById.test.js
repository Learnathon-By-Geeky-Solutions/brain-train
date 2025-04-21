import request from "supertest";
import app from "../../../app.js";
import { deleteSearchHistory } from "../../../libraries/models/userSearchHistory.js";
import { decodeFirebaseIdToken } from "../../../libraries/services/firebase.js";

describe("GET /search/recipes/:id Test", () => {
  const endpoint = "/search/recipes/";
  const invalidId = "123-invalid";
  const nonExistentId = "609e1263fc13ae1abf000000";
  let recipeId = "";

  it("should return 400 for invalid recipeId search", async () => {
    const response = await request(app)
      .get(`${endpoint}${invalidId}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid recipe.");
  });

  it("should return 404 for non existent recipeId search", async () => {
    const response = await request(app)
      .get(`${endpoint}${nonExistentId}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Recipe not found.");
  });

  it("should return 200 for valid recipeId from search results", async () => {
    let response = await request(app)
      .get("/search/recipes?query=rice")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
    expect(Array.isArray(response.body.results)).toBe(true);

    const recipes = response.body.results;

    expect(recipes.length).toBeGreaterThan(0);
    expect(recipes[0]).toHaveProperty("id");

    recipeId = recipes[0].id;
    expect(recipeId).toBeDefined();

    response = await request(app)
      .get(`${endpoint}${recipeId}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);
    const recipe = response.body;

    expect(recipe).toHaveProperty("sourceId");
    expect(recipe).toHaveProperty("isUploaded");
    expect(recipe).toHaveProperty("title");
    expect(recipe).toHaveProperty("image");
    expect(recipe).toHaveProperty("summary");
    expect(recipe).toHaveProperty("vegetarian");
    expect(recipe).toHaveProperty("vegan");
    expect(recipe).toHaveProperty("glutenFree");
    expect(recipe).toHaveProperty("dairyFree");
    expect(recipe).toHaveProperty("readyInMinutes");
    expect(recipe).toHaveProperty("likes");
    expect(recipe).toHaveProperty("servings");

    expect(recipe).toHaveProperty("cuisines");
    expect(Array.isArray(recipe.cuisines)).toBe(true);

    expect(recipe).toHaveProperty("dishTypes");
    expect(Array.isArray(recipe.dishTypes)).toBe(true);

    expect(recipe).toHaveProperty("diets");
    expect(Array.isArray(recipe.diets)).toBe(true);

    expect(recipe).toHaveProperty("instructions");
    expect(Array.isArray(recipe.instructions)).toBe(true);

    expect(recipe).toHaveProperty("ingredients");
    expect(Array.isArray(recipe.ingredients)).toBe(true);

    expect(recipe.ingredients.length).toBeGreaterThan(0);
    const ingredient = recipe.ingredients[0];
    expect(ingredient).toHaveProperty("title");
    expect(ingredient).toHaveProperty("image");
    expect(ingredient).toHaveProperty("amount");
    expect(ingredient).toHaveProperty("unit");

    expect(recipe).toHaveProperty("nutrition");

    expect(recipe.nutrition).toHaveProperty("nutrients");
    expect(Array.isArray(recipe.nutrition.nutrients)).toBe(true);

    expect(recipe.nutrition.nutrients.length).toBeGreaterThan(0);
    const nutrient = recipe.nutrition.nutrients[0];
    expect(nutrient).toHaveProperty("name");
    expect(nutrient).toHaveProperty("amount");
    expect(nutrient).toHaveProperty("unit");
    expect(nutrient).toHaveProperty("percentOfDailyNeeds");

    expect(recipe.nutrition).toHaveProperty("properties");
    expect(Array.isArray(recipe.nutrition.properties)).toBe(true);
    expect(recipe.nutrition.properties.length).toBeGreaterThan(0);
    const property = recipe.nutrition.properties[0];
    expect(property).toHaveProperty("name");
    expect(property).toHaveProperty("amount");
    expect(property).toHaveProperty("unit");
  });

  it("should return 200 and create entry in search history for new user", async () => {
    const response = await request(app)
      .get(`${endpoint}${recipeId}`)
      .set("Authorization", `Bearer ${global.__DISPOSABLE_USER_TOKEN__}`);

    const { uid } = await decodeFirebaseIdToken(
      `Bearer ${global.__DISPOSABLE_USER_TOKEN__}`,
    );

    await deleteSearchHistory(uid);

    expect(response.status).toBe(200);

    const recipe = response.body;

    expect(recipe).toHaveProperty("sourceId");
    expect(recipe).toHaveProperty("isUploaded");
    expect(recipe).toHaveProperty("title");
    expect(recipe).toHaveProperty("image");
    expect(recipe).toHaveProperty("summary");
    expect(recipe).toHaveProperty("vegetarian");
    expect(recipe).toHaveProperty("vegan");
    expect(recipe).toHaveProperty("glutenFree");
    expect(recipe).toHaveProperty("dairyFree");
    expect(recipe).toHaveProperty("readyInMinutes");
    expect(recipe).toHaveProperty("likes");
    expect(recipe).toHaveProperty("servings");

    expect(recipe).toHaveProperty("cuisines");
    expect(Array.isArray(recipe.cuisines)).toBe(true);

    expect(recipe).toHaveProperty("dishTypes");
    expect(Array.isArray(recipe.dishTypes)).toBe(true);

    expect(recipe).toHaveProperty("diets");
    expect(Array.isArray(recipe.diets)).toBe(true);

    expect(recipe).toHaveProperty("instructions");
    expect(Array.isArray(recipe.instructions)).toBe(true);

    expect(recipe).toHaveProperty("ingredients");
    expect(Array.isArray(recipe.ingredients)).toBe(true);

    expect(recipe.ingredients.length).toBeGreaterThan(0);
    const ingredient = recipe.ingredients[0];
    expect(ingredient).toHaveProperty("title");
    expect(ingredient).toHaveProperty("image");
    expect(ingredient).toHaveProperty("amount");
    expect(ingredient).toHaveProperty("unit");

    expect(recipe).toHaveProperty("nutrition");

    expect(recipe.nutrition).toHaveProperty("nutrients");
    expect(Array.isArray(recipe.nutrition.nutrients)).toBe(true);

    expect(recipe.nutrition.nutrients.length).toBeGreaterThan(0);
    const nutrient = recipe.nutrition.nutrients[0];
    expect(nutrient).toHaveProperty("name");
    expect(nutrient).toHaveProperty("amount");
    expect(nutrient).toHaveProperty("unit");
    expect(nutrient).toHaveProperty("percentOfDailyNeeds");

    expect(recipe.nutrition).toHaveProperty("properties");
    expect(Array.isArray(recipe.nutrition.properties)).toBe(true);
    expect(recipe.nutrition.properties.length).toBeGreaterThan(0);
    const property = recipe.nutrition.properties[0];
    expect(property).toHaveProperty("name");
    expect(property).toHaveProperty("amount");
    expect(property).toHaveProperty("unit");
  });
});
