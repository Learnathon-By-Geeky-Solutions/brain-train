import request from "supertest";
import app from "../../../app.js";
import mongoose from "mongoose";

describe("DELETE /ai/chat/:chatId", () => {
  let chatId;

  beforeAll(async () => {
    // Create a new chat first to delete it
    const res = await request(app)
      .post("/ai/chat")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)

      .field("text", "Is dosa suitable for vegetarian?");
    chatId = res.body.chatId;
    console.log("Chat ID created:", chatId); // Log the chat ID for debugging
  });
  it("should  return 500 for unauthenticated user", async () => {
    const res = await request(app).delete(`/ai/chat/${chatId}`);

    expect(res.status).toBe(500);
  });

  it("should delete the chat and return 200", async () => {
    const res = await request(app)
      .delete(`/ai/chat/${chatId}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Chat deleted");
    expect(res.body).toHaveProperty("chatId", chatId);
  });

  it("should return 400 for invalid chatId format", async () => {
    const res = await request(app)
      .delete("/ai/chat/invalid-id")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 404 for non-existing chatId", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/ai/chat/${fakeId}`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});
