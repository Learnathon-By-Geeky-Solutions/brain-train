import request from "supertest";
import app from "../../../app.js";
import mongoose from "mongoose";

describe("PATCH /ai/chat/:chatId/rename", () => {
  let chatId;

  beforeAll(async () => {
    // Create a chat first
    const res = await request(app)
      .post("/ai/chat")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .field("text", "Is dosa suitable for vegetarian?");
    chatId = res.body.chatId;
    console.log("Chat ID created:", chatId); // Log the chat ID for debugging
  });

  it("should rename a chat successfully", async () => {
    const newName = "testing LLM";
    const res = await request(app)
      .patch(`/ai/chat/${chatId}/rename`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .send({ name: newName }); // Use send instead of field for JSON body
    console.log("status:", res.status); // Log the status for debugging
    console.log("Response:", res.body); // Log the response for debugging
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id", chatId);
    expect(res.body).toHaveProperty("name", newName);
  });
  it("should return 500 for unauthenticated user", async () => {
    const res = await request(app)
      .patch(`/ai/chat/${chatId}/rename`)
      .send({ name: "Unauthenticated Test" }); // Use send instead of field for JSON body

    expect(res.status).toBe(500);
  });

  it("should return 400 for invalid chatId", async () => {
    const res = await request(app)
      .patch("/ai/chat/invalid-id/rename")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .send({ name: "Invalid Test" }); // Use send instead of field for JSON body

    console.log("status:", res.status); // Log the status for debugging
    console.log("Response:", res.body); // Log the response for debugging

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 404 for non-existing chatId", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/ai/chat/${fakeId}/rename`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .send({ name: "Ghost Test" }); // Use send instead of field for JSON body

    console.log("status:", res.status); // Log the status for debugging
    console.log("Response:", res.body); // Log the response for debugging

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if name is missing", async () => {
    const res = await request(app)
      .patch(`/ai/chat/${chatId}/rename`)
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .send({}); // no name

    console.log("status:", res.status); // Log the status for debugging
    console.log("Response:", res.body); // Log the response for debugging

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
