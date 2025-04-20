import request from "supertest";
import app from "../../../app.js";

describe("Get Info Endpoint Test", () => {
  const endpoint = "/search/recipes";

  it("should return 500 when accessed with authentification", async () => {
    const firstResponse = await request(app)
      .get(`${endpoint}?ingredients=caviar&fields=title,image,summary,likes`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body).toHaveProperty("results");
    const recipes = firstResponse.body.results;
    expect(Array.isArray(recipes)).toBe(true);
    expect(recipes.length).toBeGreaterThan(0);

    const Id = recipes[0].id;
    const response = await request(app).get(`${endpoint}/${Id}`);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 when accessed with authentification", async () => {
    const Id = 1234567890;
    const response = await request(app).get(`${endpoint}/${Id}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
  it("should return 404 when accessed with authentification", async () => {
    const Id = "67b40ef7876176ca1b45e4d0";
    const response = await request(app)
      .get(`${endpoint}/${Id}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 200 with recipes for an authenticated user", async () => {
    const firstResponse = await request(app)
      .get(`${endpoint}?ingredients=caviar&fields=title,image,summary,likes`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body).toHaveProperty("results");
    const firstrecipes = firstResponse.body.results;
    expect(Array.isArray(firstrecipes)).toBe(true);
    expect(firstrecipes.length).toBeGreaterThan(0);

    const Id = firstrecipes[0].id;
    const response = await request(app)
      .get(`${endpoint}/${Id}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);

    const recipes = response.body;

    expect(recipes).toHaveProperty("_id");
    expect(recipes).toHaveProperty("image");
    expect(recipes).toHaveProperty("title");
    expect(recipes).toHaveProperty("likes");
    expect(recipes).toHaveProperty("summary");
    expect(recipes).toHaveProperty("sourceId");
    expect(recipes).toHaveProperty("nutrition");
    expect(recipes).toHaveProperty("ingredients");
  });
});

describe("Get Summary Endpoint Test", () => {
  const endpoint = "/search/recipes";

  it("should return 400 when accessed with authentification", async () => {
    const Id = 1234567890;
    const response = await request(app).get(`${endpoint}/${Id}/summary`);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
  it("should return 404 when accessed with authentification", async () => {
    const Id = "67b40ef7876176ca1b45e4d0";
    const response = await request(app).get(`${endpoint}/${Id}/summary`);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 200 with recipes for an authenticated user", async () => {
    const firstResponse = await request(app)
      .get(`${endpoint}?ingredients=caviar&fields=title,image,summary,likes`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body).toHaveProperty("results");
    const firstrecipes = firstResponse.body.results;
    expect(Array.isArray(firstrecipes)).toBe(true);
    expect(firstrecipes.length).toBeGreaterThan(0);

    const Id = firstrecipes[0].id;
    const response = await request(app)
      .get(`${endpoint}/${Id}/summary`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);

    const recipes = response.body;

    expect(recipes).toHaveProperty("summary");
  });
});
