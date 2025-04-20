import request from "supertest";
import app from "../../../app.js";
import path from "path";
import { fileURLToPath } from "url";

import { BaseVisionService } from "../../../libraries/services/vision-service/baseVisionService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("BaseVisionService", () => {
  it("should throw an error if analyzeImage() is called directly", async () => {
    const baseVision = new BaseVisionService();

    await expect(baseVision.analyzeImage("dummy-base64")).rejects.toThrow(
      "analyzeImage() must be implemented by subclass",
    );
  });
});

describe("POST /ai/analyze/ingredients", () => {
  it("should return ingredients and matching recipes", async () => {
    const testImagePath = path.join(__dirname, "./files/grocery.jpg");

    const res = await request(app)
      .post("/ai/analyze/ingredients")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .attach("image", testImagePath);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("imageUrl");
    expect(res.body).toHaveProperty("ingredients");
    expect(Array.isArray(res.body.ingredients)).toBe(true);
    expect(res.body.ingredients[0]).toHaveProperty("name");
    expect(res.body.ingredients[0]).toHaveProperty("confidence");

    expect(res.body).toHaveProperty("results");
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results[0]).toHaveProperty("title");
    expect(res.body.results[0]).toHaveProperty("image");
    expect(res.body.results[0]).toHaveProperty("summary");
    expect(res.body.results[0]).toHaveProperty("likes");

    expect(res.body).toHaveProperty("totalResults");
    expect(typeof res.body.totalResults).toBe("number");
  });

  it("should return 500", async () => {
    const testImagePath = path.join(__dirname, "./files/grocery.jpg");

    const res = await request(app)
      .post("/ai/analyze/ingredients?type=google")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .attach("image", testImagePath);

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 with pdf", async () => {
    const testImagePath = path.join(__dirname, "./files/shoppingList.pdf");

    const res = await request(app)
      .post("/ai/analyze/ingredients")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .attach("image", testImagePath);

    expect([400, 413]).toContain(res.status); // 413 if too large
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 error for no images", async () => {
    const res = await request(app)
      .post("/ai/analyze/ingredients")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 413 error for large images", async () => {
    const testImagePath = path.join(__dirname, "./files/largeFile.jpg");

    const res = await request(app)
      .post("/ai/analyze/ingredients")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .attach("image", testImagePath);

    expect(res.status).toBe(413);
    expect(res.body).toHaveProperty("error");
  });
});
