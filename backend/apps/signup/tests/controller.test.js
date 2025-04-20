import dotenv from "dotenv";
import request from "supertest";
import app from "../../../app.js";
import { User } from "../../../libraries/models/users";

dotenv.config();

describe("POST /signup", () => {
  it("should successfully sign up a new user", async () => {
    await User.deleteOne({ email: process.env.DISPOSABLE_USER_EMAIL });

    const token = global.__DISPOSABLE_USER_TOKEN__;

    const res = await request(app)
      .post("/signup")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: process.env.DISPOSABLE_USER_NAME,
        email: process.env.DISPOSABLE_USER_EMAIL,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User created");
  });

  it("should return 201 on successful signin by a new user", async () => {
    await User.deleteOne({ email: process.env.DISPOSABLE_USER_EMAIL });

    const token = global.__DISPOSABLE_USER_TOKEN__;

    const res = await request(app)
      .post("/signin")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      message: "Login successful",
      username: process.env.DISPOSABLE_USER_NAME,
    });
  });

  it("should return 500 if token is invalid or decoding fails", async () => {
    const response = await request(app)
      .post("/signup")
      .set("Authorization", "Bearer INVALID_TOKEN")
      .send({
        name: process.env.DISPOSABLE_USER_NAME,
        email: process.env.DISPOSABLE_USER_EMAIL,
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
  });
});
