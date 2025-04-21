import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const globalDataPath = path.resolve(__dirname, "globalSetupData.json");

if (fs.existsSync(globalDataPath)) {
  const data = JSON.parse(fs.readFileSync(globalDataPath, "utf-8"));
  global.__TEST_TOKEN__ = data.__TEST_TOKEN__;
  global.__DISPOSABLE_USER_TOKEN__ = data.__DISPOSABLE_USER_TOKEN__;
} else {
  console.error(
    "❌ globalSetupData.json not found. Make sure globalSetup ran.",
  );
}

afterAll(async () => {
  await mongoose.connection.close();
});
