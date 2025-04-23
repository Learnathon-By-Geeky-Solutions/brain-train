import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import axios from "axios";
import https from "https";
import http from "http";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const httpsAgent = new https.Agent({ keepAlive: false });
const httpAgent = new http.Agent({ keepAlive: false });

const globalDataPath = path.resolve(__dirname, "globalSetupData.json");

export default async () => {
  try {
    const testUserResponse = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
        returnSecureToken: true,
      },
      { httpsAgent, httpAgent },
    );

    const disposableUserResponse = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        email: process.env.DISPOSABLE_USER_EMAIL,
        password: process.env.DISPOSABLE_USER_PASSWORD,
        returnSecureToken: true,
      },
      { httpsAgent, httpAgent },
    );

    const tokenData = {
      __TEST_TOKEN__: testUserResponse.data.idToken,
      __DISPOSABLE_USER_TOKEN__: disposableUserResponse.data.idToken,
    };

    fs.writeFileSync(globalDataPath, JSON.stringify(tokenData));
  } catch (error) {
    console.error(
      "🔥 Firebase Global Login Failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
