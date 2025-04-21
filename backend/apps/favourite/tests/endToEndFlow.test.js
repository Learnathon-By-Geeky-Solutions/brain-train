import request from "supertest";
import app from "../../../app.js";
import { decodeFirebaseIdToken } from "../../../libraries/services/firebase.js";
import UserFavourites from "../../../libraries/models/userFavourites.js";

describe("Favourites End-to-End Flow", () => {
  let originalFavourites = [];
  let tempStoredRecipe = null;

  describe("🔍 Listing and Basic Validations", () => {
    it("should retrieve the current list of favourite recipes", async () => {
      const response = await request(app)
        .get("/favourites/list")
        .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("recipes");
      expect(Array.isArray(response.body.recipes)).toBe(true);

      originalFavourites = response.body.recipes;
      expect(originalFavourites.length).toBeGreaterThan(0);

      tempStoredRecipe = originalFavourites[0];

      originalFavourites.forEach((recipe) => {
        expect(recipe).toHaveProperty("id");
        expect(recipe).toHaveProperty("title");
        expect(recipe).toHaveProperty("image");
        expect(recipe).toHaveProperty("likes");
        expect(recipe).toHaveProperty("summary");
      });
    });

    it("should fail to add a duplicate favourite recipe", async () => {
      const response = await request(app)
        .post("/favourites/addRecipe")
        .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
        .send({ recipeId: tempStoredRecipe.id });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        "error",
        "Recipe already in favourites",
      );
    });
  });

  describe("🔄 Modification Flow (Remove, Add Back)", () => {
    it("should remove all recipes from favourites", async () => {
      for (const recipe of originalFavourites) {
        const response = await request(app)
          .delete("/favourites/removeRecipe")
          .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
          .send({ recipeId: recipe.id });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
          "message",
          "Recipe removed from favourites",
        );
      }
    });

    it("should return an empty list after removing all favourites", async () => {
      const response = await request(app)
        .get("/favourites/list")
        .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("recipes");
      expect(Array.isArray(response.body.recipes)).toBe(true);
      expect(response.body.recipes).toHaveLength(0);
    });

    it("should fail to remove a recipe that's no longer in favourites", async () => {
      const response = await request(app)
        .delete("/favourites/removeRecipe")
        .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
        .send({ recipeId: tempStoredRecipe.id });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Recipe not in favourites");
    });

    it("should re-add the original favourite recipes", async () => {
      for (const recipe of originalFavourites) {
        const response = await request(app)
          .post("/favourites/addRecipe")
          .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
          .send({ recipeId: recipe.id });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty(
          "message",
          "Recipe added to favourites",
        );
      }
    });
  });

  describe("🔐 Auth Error Cases", () => {
    it("should fail to list favourites without authorization", async () => {
      const response = await request(app).get("/favourites/list");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });

    it("should fail to add a favourite recipe without authorization", async () => {
      const response = await request(app)
        .post("/favourites/addRecipe")
        .send({ recipeId: tempStoredRecipe.id });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });

    it("should fail to remove a favourite recipe without authorization", async () => {
      const response = await request(app)
        .delete("/favourites/removeRecipe")
        .send({ recipeId: tempStoredRecipe.id });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("🧪 Database Recreation Logic", () => {
    it("should recreate UserFavourites and re-add all previous favourite recipes", async () => {
      const listResponse = await request(app)
        .get("/favourites/list")
        .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

      expect(listResponse.status).toBe(200);
      const { recipes } = listResponse.body;
      expect(Array.isArray(recipes)).toBe(true);
      expect(recipes.length).toBeGreaterThan(0);

      const originalRecipes = [...recipes];

      const { uid } = await decodeFirebaseIdToken(
        `Bearer ${global.__TEST_TOKEN__}`,
      );
      await UserFavourites.deleteOne({ firebaseUid: uid });

      for (const recipe of originalRecipes) {
        const response = await request(app)
          .post("/favourites/addRecipe")
          .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
          .send({ recipeId: recipe.id });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty(
          "message",
          "Recipe added to favourites",
        );
      }
    });
  });
});
