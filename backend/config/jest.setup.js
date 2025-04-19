import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import https from "https";
import http from "http";

const httpsAgent = new https.Agent({ keepAlive: false });
const httpAgent = new http.Agent({ keepAlive: false });

dotenv.config();

global.__TEST_TOKEN__ = null;

beforeAll(async () => {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
        returnSecureToken: true,
      },
      {
        httpsAgent,
        httpAgent,
      },
    );

    global.__TEST_TOKEN__ = response.data.idToken;
  } catch (error) {
    console.error(
      "🔥 Firebase Login Failed:",
      error.response?.data || error.message,
    );
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
