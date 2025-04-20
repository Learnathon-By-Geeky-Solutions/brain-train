import request from "supertest";
import app from "../../../app.js";
import RecipeModel from "../../../libraries/models/recipes.js";

describe("Search By Ingredients Endpoint Test", () => {
  const endpoint = "/search/recipes/ingredients";

  it("should return 500 when accessed with authentification", async () => {
    const response = await request(app).get(`${endpoint}?query=chicken`);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 200 with recipes for an authenticated user,db+ api fallback", async () => {
    const response = await request(app)
      .get(
        `${endpoint}?ingredients=caviar&fields=title,image,summary,likes&cuisine=Asian&glutenFree=true`,
      )
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

  it("should return 200 with recipes for an authenticated user,enough db result", async () => {
    const response = await request(app)
      .get(`${endpoint}?ingredients=rice&fields=title,image,summary,likes`)
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

  it("should return 200 with recipes for an authenticated user,no recipe", async () => {
    const response = await request(app)
      .get(
        `${endpoint}?ingredients=fish&fields=title,image,summary,likes&vegetarian=true&glutenFree=true`,
      )
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
    expect(Array.isArray(response.body.results)).toBe(true);

    const recipes = response.body.results;

    expect(recipes.length).toBeGreaterThanOrEqual(0);
  });

  it("should return 500 with recipes for an authenticated user, ingr fields not given", async () => {
    const response = await request(app)
      .get(
        `${endpoint}?fields=title,image,summary,likes&vegetarian=true&glutenFree=true`,
      )
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 200 with recipes and fallback after deletion", async () => {
    // Step 1: Initial API call
    const firstResponse = await request(app)
      .get(`${endpoint}?ingredients=caviar&fields=title,image,summary,likes`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body).toHaveProperty("results");
    const recipes = firstResponse.body.results;
    expect(Array.isArray(recipes)).toBe(true);
    expect(recipes.length).toBeGreaterThan(0);

    const deletedId = recipes[0].id;

    // Step 2: Delete the recipe by _id
    await RecipeModel.findByIdAndDelete(deletedId);

    // Step 3: Call the same endpoint again
    const secondResponse = await request(app)
      .get(
        `${endpoint}?ingredients=caviar&fields=title,image,summary,likes&cuisine=Asian&glutenFree=true`,
      )
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(secondResponse.status).toBe(200);
    const secondRecipes = secondResponse.body.results;
    expect(Array.isArray(secondRecipes)).toBe(true);
    expect(secondRecipes.find((r) => r.id === deletedId)).toBeUndefined();
  });
});
