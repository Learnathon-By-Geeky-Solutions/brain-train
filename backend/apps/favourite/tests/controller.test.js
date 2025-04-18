import request from "supertest";
import app from "../../../app.js";
import { decodeFirebaseIdToken } from "../../../libraries/services/firebase.js";
import UserFavourites from "../../../libraries/models/userFavourites.js";

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

describe("Favourites Error Cases", () => {
  const invalidId = "123-invalid";
  const nonExistentId = "609e1263fc13ae1abf000000";

  it("should return 400 for invalid recipeId in addRecipe", async () => {
    const response = await request(app)
      .post("/favourites/addRecipe")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .send({ recipeId: invalidId });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid recipe ID");
  });

  it("should return 400 for invalid recipeId in removeRecipe", async () => {
    const response = await request(app)
      .delete("/favourites/removeRecipe")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .send({ recipeId: invalidId });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid recipe ID");
  });

  it("should return 404 when adding a recipe that doesn't exist", async () => {
    const response = await request(app)
      .post("/favourites/addRecipe")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .send({ recipeId: nonExistentId });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Recipe not found");
  });
});

describe("Favourite Recipe Addition By New User", () => {
  it("should recreate UserFavourites and re-add all previous favourite recipes", async () => {
    // Step 1: Get current favourites for the user
    const listResponse = await request(app)
      .get("/favourites/list")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`);

    expect(listResponse.status).toBe(200);
    const { recipes } = listResponse.body;
    expect(Array.isArray(recipes)).toBe(true);
    expect(recipes.length).toBeGreaterThan(0);

    // Save the original list
    const originalRecipes = [...recipes];

    // Step 2: Decode UID and delete UserFavourites entry
    const { uid } = await decodeFirebaseIdToken(
      `Bearer ${global.__TEST_TOKEN__}`,
    );
    await UserFavourites.deleteOne({ firebaseUid: uid });

    // Step 3: Add all recipes again (should recreate the document and populate it)
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
