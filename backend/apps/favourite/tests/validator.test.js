import request from "supertest";
import app from "../../../app.js";

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
