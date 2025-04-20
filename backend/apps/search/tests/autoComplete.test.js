import request from "supertest";
import app from "../../../app.js";

describe("AutoComplete title Endpoint Test", () => {
  const endpoint = "/search/title/autocomplete";
  it("should return 200 with recipes suggestions,triggers db + api", async () => {
    const response = await request(app)
      .get(`${endpoint}?query=mule`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const recipes = response.body;

    expect(recipes.length).toBeGreaterThan(0);
    expect(recipes[0]).toHaveProperty("id");

    expect(recipes[0]).toHaveProperty("title");
  });
  it("should return 200 with recipes suggestions,triggers db,enough result", async () => {
    const response = await request(app)
      .get(`${endpoint}?query=ric`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const recipes = response.body;

    expect(recipes.length).toBeGreaterThan(0);
    expect(recipes[0]).toHaveProperty("id");

    expect(recipes[0]).toHaveProperty("title");
  });

  it("should return 500 for no query param", async () => {
    const response = await request(app)
      .get(`${endpoint}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});

describe("AutoComplete  Ingr Endpoint Test", () => {
  const endpoint = "/search/ingredients/autocomplete";
  it("should return 200 with recipes suggestions,triggers api", async () => {
    const response = await request(app)
      .get(`${endpoint}?query=cav`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    const recipes = response.body;

    expect(recipes.length).toBeGreaterThan(0);

    expect(recipes[0]).toHaveProperty("name");
  });
  it("should return 500 for no query parameter", async () => {
    const response = await request(app)
      .get(`${endpoint}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
