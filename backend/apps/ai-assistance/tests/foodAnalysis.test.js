import request from "supertest";
import app from "../../../app.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("POST /ai/analyze/food", () => {
  it("should return nutritions and matching recipes", async () => {
    const testImagePath = path.join(__dirname, "./files/grocery.jpg");

    const res = await request(app)
      .post("/ai/analyze/food")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .attach("image", testImagePath);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("imageUrl");
    expect(typeof res.body.imageUrl).toBe("string");

    // Category
    expect(res.body).toHaveProperty("category");
    expect(res.body.category).toHaveProperty("name");
    expect(res.body.category).toHaveProperty("probability");
    expect(typeof res.body.category.name).toBe("string");
    expect(typeof res.body.category.probability).toBe("number");

    // Nutrition
    expect(res.body).toHaveProperty("nutrition");
    expect(res.body.nutrition).toHaveProperty("recipesUsed");
    expect(typeof res.body.nutrition.recipesUsed).toBe("number");

    ["calories", "fat", "protein", "carbs"].forEach((key) => {
      expect(res.body.nutrition).toHaveProperty(key);
      const item = res.body.nutrition[key];
      expect(item).toHaveProperty("value");
      expect(item).toHaveProperty("unit");
      expect(item).toHaveProperty("confidenceRange95Percent");
      expect(item).toHaveProperty("standardDeviation");
      expect(typeof item.value).toBe("number");
      expect(typeof item.unit).toBe("string");
    });

    // Results (recipes)
    expect(Array.isArray(res.body.results)).toBe(true);
    res.body.results.forEach((recipe) => {
      expect(recipe).toHaveProperty("_id");
      expect(recipe).toHaveProperty("title");
      expect(recipe).toHaveProperty("image");
      expect(recipe).toHaveProperty("summary");
      expect(typeof recipe.title).toBe("string");
      expect(typeof recipe.image).toBe("string");
    });

    expect(res.body).toHaveProperty("totalResults");
    expect(typeof res.body.totalResults).toBe("number");
  });

  it("should return 400 error for no images", async () => {
    const res = await request(app)
      .post("/ai/analyze/food")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
  it("checking uploads folder", async () => {
    const testImagePath = path.join(__dirname, "./files/burger.jpg");

    const res = await request(app)
      .post("/ai/analyze/food")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .attach("image", testImagePath);

    expect(res.status).toBe(200);

    const uploadsRes = await request(app)
      .get("/ai//uploads")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(uploadsRes.status).toBe(200);
    expect(Array.isArray(uploadsRes.body.uploads)).toBe(true);
  });
});
