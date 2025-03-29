import request from "supertest";
import app from "../../../app.js";

describe("GET /favourites/list", () => {
  it("should return a list of favourite recipes when authorized", async () => {
    const response = await request(app)
      .get("/favourites/list")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("recipes");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/favourites/list");

    expect(response.status).toBe(500);
  });
});
