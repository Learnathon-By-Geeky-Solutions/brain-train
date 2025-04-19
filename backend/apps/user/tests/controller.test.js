import request from "supertest";
import app from "../../../app.js";

describe("POST /user/checkUsername", () => {
  it("should return 400 for invalid username format", async () => {
    const response = await request(app)
      .post("/user/checkUsername")
      .send({ username: "ic;- &@  " });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid username format");
    expect(response.body.available).toBe(false);
  });

  it("should return 400 for empty username", async () => {
    const response = await request(app)
      .post("/user/checkUsername")
      .send({ username: "" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid username format");
    expect(response.body.available).toBe(false);
  });

  it("should return 409 if username already exists", async () => {
    const response = await request(app)
      .post("/user/checkUsername")
      .send({ username: "mr tazwar" });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("Username already exists");
    expect(response.body.available).toBe(false);
  });

  it("should return 200 if username is available", async () => {
    const response = await request(app)
      .post("/user/checkUsername")
      .send({ username: "ic78-pokahontas_920131" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Username available");
    expect(response.body.available).toBe(true);
  });
});
