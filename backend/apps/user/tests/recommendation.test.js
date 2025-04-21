import request from "supertest";
import app from "../../../app.js";
import SimilarRecipe from "../../../libraries/models/similarRecipes.js";
import { deleteSearchHistory } from "../../../libraries/models/userSearchHistory.js";
import { decodeFirebaseIdToken } from "../../../libraries/services/firebase.js";

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
    const { uid } = decodeFirebaseIdToken(
      `Bearer ${global.__DISPOSABLE_USER_TOKEN__}`,
    );
    await deleteSearchHistory(uid);
    const response = await request(app)
      .get(`${endpoint}`)
      .set("Authorization", `Bearer ${global.__DISPOSABLE_USER_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
    expect(Array.isArray(response.body.results)).toBe(true);
    expect(response.body.results).toHaveLength(0);
  });

  it("should return 500 for unauthenticated users", async () => {
    const response = await request(app).get(`${endpoint}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 200 with spoonacular fallback for recipe recommendations not in db", async () => {
    let response = await request(app)
      .get(`/search/history/10`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("results");
    expect(Array.isArray(response.body.results)).toBe(true);

    const history = response.body.results;

    expect(history.length).toBeGreaterThan(0);

    const latestSearch = history[0];

    expect(latestSearch).toHaveProperty("id");

    const latestSearchId = latestSearch.id;

    await SimilarRecipe.deleteOne({ recipeId: latestSearchId });

    response = await request(app)
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
});
