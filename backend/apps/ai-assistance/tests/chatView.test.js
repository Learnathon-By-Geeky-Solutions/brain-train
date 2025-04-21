import request from "supertest";
import app from "../../../app.js";
import mongoose from "mongoose";

describe("GET /ai/chat/:chatId", () => {
  let chatId;

  beforeAll(async () => {
    // Create a chat first so we have a known ID to retrieve

    const createRes = await request(app)
      .post("/ai/chat")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .field("text", "Is dosa suitable for vegetarian?");
    chatId = createRes.body.chatId;
  });

  it("should return a chat object with messages", async () => {
    const res = await await request(app)
      .get(`/ai/chat/${chatId}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id", chatId);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("messages");
    expect(Array.isArray(res.body.messages)).toBe(true);
    expect(res.body.messages.length).toBeGreaterThan(0);

    const userMessage = res.body.messages.find((msg) => msg.role === "user");
    expect(userMessage).toHaveProperty(
      "text",
      "Is dosa suitable for vegetarian?",
    );
    expect(userMessage).toHaveProperty("status", "complete");
  });

  it("should return 400 for invalid chatId", async () => {
    const res = await request(app)
      .get("/ai/chat/invalid-id")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 404 for non-existing chatId", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/ai/chat/${nonExistentId}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});
