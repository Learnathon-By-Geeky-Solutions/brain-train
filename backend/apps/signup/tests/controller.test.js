import dotenv from "dotenv";
import axios from "axios";
import https from "https";
import http from "http";
import request from "supertest";
import app from "../../../app.js";
import { User } from "../../../libraries/models/users";

const httpsAgent = new https.Agent({ keepAlive: false });
const httpAgent = new http.Agent({ keepAlive: false });

dotenv.config();

describe("POST /signup", () => {
  it("should successfully sign up a new user", async () => {
    await User.deleteOne({ email: process.env.DISCARDED_USER_EMAIL });

    const loginRes = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        email: process.env.DISCARDED_USER_EMAIL,
        password: process.env.DISCARDED_USER_PASSWORD,
        returnSecureToken: true,
      },
      {
        httpsAgent,
        httpAgent,
      },
    );

    const token = loginRes.data.idToken;

    const res = await request(app)
      .post("/signup")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: process.env.DISCARDED_USER_NAME,
        email: process.env.DISCARDED_USER_EMAIL,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User created");
  });

  it("should return 500 if token is invalid or decoding fails", async () => {
    const response = await request(app)
      .post("/signup")
      .set("Authorization", "Bearer INVALID_TOKEN")
      .send({
        name: process.env.DISCARDED_USER_NAME,
        email: process.env.DISCARDED_USER_EMAIL,
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toMatch(/Signup error:/);
  });
});
