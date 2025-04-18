import request from "supertest";
import app from "../../../app.js";

describe("Favourites End-to-End Flow", () => {
  let originalFavourites = [];
  let tempStoredRecipe = null;

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

describe("Favourites Validators", () => {
  describe("validateAddRecipe", () => {
    it("should fail when recipeId is missing", async () => {
      const response = await request(app)
        .post("/favourites/addRecipe")
        .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe("recipeId is required");
    });

    it("should fail when recipeId is an empty string", async () => {
      const response = await request(app)
        .post("/favourites/addRecipe")
        .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
        .send({ recipeId: "" });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe("recipeId is required");
    });

    it("should fail when recipeId is not a string", async () => {
      const response = await request(app)
        .post("/favourites/addRecipe")
        .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
        .send({ recipeId: 12345 });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe("recipeId must be a string");
    });
  });

  describe("validateRemoveRecipe", () => {
    it("should fail when recipeId is missing", async () => {
      const response = await request(app)
        .delete("/favourites/removeRecipe")
        .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe("recipeId is required");
    });

    it("should fail when recipeId is an empty string", async () => {
      const response = await request(app)
        .delete("/favourites/removeRecipe")
        .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
        .send({ recipeId: "" });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe("recipeId is required");
    });

    it("should fail when recipeId is not a string", async () => {
      const response = await request(app)
        .delete("/favourites/removeRecipe")
        .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
        .send({ recipeId: true });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe("recipeId must be a string");
    });
  });
});
