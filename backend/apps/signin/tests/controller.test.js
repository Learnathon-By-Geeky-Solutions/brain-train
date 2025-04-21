import dotenv from "dotenv";
import request from "supertest";
import app from "../../../app.js";

dotenv.config();

describe("POST /signin route", () => {
  it("should return 401 on signin with invalid auth token", async () => {
    const response = await request(app)
      .post("/signin")
      .set("Authorization", `Bearer fake-token`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 200 on successful signin by an existing user", async () => {
    const res = await request(app)
      .post("/signin")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      message: "Login successful",
      username: process.env.TEST_USER_NAME,
    });
  });
});
