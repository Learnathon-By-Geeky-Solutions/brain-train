import path from "path";
import fs from "fs";
import request from "supertest";
import { jest } from "@jest/globals";
import app from "../../../app.js"; // Adjust as needed

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { BaseChatService } from "../../../libraries/services/chat-service/baseChatService.js";

describe("BaseChatService", () => {
  it("should throw when sendMessage is called directly", async () => {
    const base = new BaseChatService();

    await expect(base.sendMessage([])).rejects.toThrow(
      "sendMessage method not implemented",
    );
  });
});

describe("POST /ai/chat", () => {
  const imagePath = path.join(__dirname, "./files/pizza.jpg");
  const sampleText = "Is the food suitable for vegetarian?";

  it("should respond with chatId and assistant message for new chat creation", async () => {
    expect(fs.existsSync(imagePath)).toBe(true);

    const res = await request(app)
      .post("/ai/chat")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .field("text", "Is the food suitable for vegetarian?")
      .attach("image", imagePath);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("chatId");
    expect(typeof res.body.chatId).toBe("string");

    expect(res.body).toHaveProperty("messages");
    expect(Array.isArray(res.body.messages)).toBe(true);
    expect(res.body.messages.length).toBeGreaterThan(0);

    const message = res.body.messages[0];
    expect(message).toHaveProperty("role", "assistant");
    expect(message).toHaveProperty("text");
    expect(typeof message.text).toBe("string");
  });
  it("should respond with updated chat containing user message", async () => {
    expect(fs.existsSync(imagePath)).toBe(true);

    const res1 = await request(app)
      .post("/ai/chat")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .field("text", "Is the food suitable for vegetarian?")
      .attach("image", imagePath);

    expect(res1.status).toBe(200);
    expect(res1.body).toHaveProperty("chatId");
    expect(typeof res1.body.chatId).toBe("string");

    const sampleChatId = res1.body.chatId;

    const res = await request(app)
      .post("/ai/chat")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .field("text", sampleText)
      .field("chatId", sampleChatId)
      .attach("image", imagePath);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("chatId", sampleChatId);
    expect(res.body).toHaveProperty("messages");
    expect(Array.isArray(res.body.messages)).toBe(true);
    expect(res.body.messages.length).toBeGreaterThan(0);

    const lastMsg = res.body.messages.at(-1);
    expect(lastMsg).toHaveProperty("role");
    expect(lastMsg).toHaveProperty("text");
    expect(typeof lastMsg.text).toBe("string");
  }, 50000);

  it("should return 400", async () => {
    const testImagePath = path.join(__dirname, "./files/grocery.jpg");

    const res = await request(app)
      .post("/ai/chat?type=google")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .attach("image", testImagePath);

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty("error");
  });
});
