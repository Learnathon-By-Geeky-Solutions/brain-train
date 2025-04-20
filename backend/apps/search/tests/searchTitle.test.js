import request from "supertest";
import app from "../../../app.js";

describe("Search By Title Endpoint Test", () => {
  const endpoint = "/search/recipes";

  it("should return 500 when accessed with authentification", async () => {
    const response = await request(app).get(`${endpoint}?query=chicken`);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 200 with recipes for an authenticated user,triggers db + api", async () => {
    const response = await request(app)
      .get(
        `${endpoint}?query=sushi&fields=title,image,summary,likes&cuisine=Asian&glutenFree=true`,
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

  it("should return 200 with recipes for an authenticated user ,db is sufficient", async () => {
    const response = await request(app)
      .get(
        `${endpoint}?query=rice&fields=title,image,summary,likes&cuisine=Asian&glutenFree=true&number=5`,
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

  it("should return 200 with recipes for an authenticated user,no filters", async () => {
    const response = await request(app)
      .get(`${endpoint}?query=rice&fields=title,image,summary,likes`)
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

  it("should return 200 with recipes for an authenticated user,empty result", async () => {
    const response = await request(app)
      .get(
        `${endpoint}?query=sushi&fields=title,image,summary,likes&vegetarian=true&glutenFree=true`,
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
});
