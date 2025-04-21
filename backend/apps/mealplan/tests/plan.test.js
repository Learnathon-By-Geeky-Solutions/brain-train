import request from "supertest";

import { summarizePlans } from "../utils/planHelper.js";
import { mapSpoonacularMeal } from "../utils/detailsHelper";
import app from "../../../app.js";

function formatDate(date) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

describe("POST /plan/generate with deleteOverlap variations", () => {
  let conflictDay;

  it("should return 409 for conflicting weekly plan tomorrow with deleteOverlap: false", async () => {
    // Create a daily plan 3 days from now
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 3);
    conflictDay = new Date();
    conflictDay.setDate(conflictDay.getDate() + 1); // tomorrow for weekly conflict

    const firstres = await request(app)
      .post("/plan/generate")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`) // if auth is required
      .send({
        timeFrame: "day",
        startDate: formatDate(startDate),
        targetCalories: 2200,
        exclude: "Chicken,pork",
        title: "Delete Overlap Plan Test",
        deleteOverlap: true,
      });
    //200 or 201 [200,201] for success
    expect([200, 201]).toContain(firstres.status);

    expect(firstres.body).toHaveProperty("success", true);
    expect(firstres.body).toHaveProperty("plan");

    const plan = firstres.body.plan;
    expect(plan).toHaveProperty("_id");
    expect(plan).toHaveProperty("title", "Delete Overlap Plan Test");
    const res = await request(app)
      .post("/plan/generate")
      .set("Authorization", `Bearer ${global.__TEST_TOKEN__}`)
      .send({
        timeFrame: "week",
        startDate: formatDate(conflictDay),
        targetCalories: 2200,
        exclude: "Chicken,pork",
        title: "Conflict Weekly Plan",
        deleteOverlap: false,
      });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("existing", true);
  });
});

describe("summarizePlans", () => {
  const commonEntry = {
    _id: "sub-id",
    title: "Test Plan",
    startDate: "2025-04-20T00:00:00.000Z",
    endDate: "2025-04-25T00:00:00.000Z",
    savedAt: "2025-04-10T12:00:00.000Z",
  };

  it("should summarize weekly plans with endDate", () => {
    const input = [{ _id: "doc1", weeklyMealPlans: [commonEntry] }];
    const result = summarizePlans(input, "week");
    expect(result[0]).toMatchObject({
      _id: "doc1",
      title: "Test Plan",
      startDate: commonEntry.startDate,
      endDate: commonEntry.endDate,
      savedAt: commonEntry.savedAt,
    });
  });

  it("should summarize daily plans without endDate", () => {
    const input = [{ _id: "doc2", dailyMealPlans: [commonEntry] }];
    const result = summarizePlans(input, "day");
    expect(result[0]).not.toHaveProperty("endDate");
  });

  it("should return empty array if field is missing", () => {
    const input = [{ _id: "doc3" }];
    const result = summarizePlans(input, "day");
    expect(result).toEqual([]);
  });
});

describe("mapSpoonacularMeal", () => {
  const meal = {
    id: 123,
    title: "Meal Title",
    image: "meal.jpg",
    imageType: "jpg",
    readyInMinutes: 30,
    servings: 2,
  };

  const recipe = {
    _id: { toString: () => "abc123" },
    title: "Recipe Title",
    image: "recipe.jpg",
    imageType: "png",
    readyInMinutes: 45,
    servings: 4,
  };

  it("should prioritize recipe values when present", () => {
    const result = mapSpoonacularMeal(meal, recipe);
    expect(result).toEqual({
      sourceId: "123",
      recipeId: "abc123",
      title: "Recipe Title",
      image: "recipe.jpg",
      imageType: "png",
      readyInMinutes: 30, // from meal
      servings: 2, // from meal
    });
  });

  it("should fall back to meal values when recipe is null", () => {
    const result = mapSpoonacularMeal(meal);
    expect(result).toEqual({
      sourceId: "123",
      recipeId: "", // no recipe
      title: "Meal Title",
      image: "meal.jpg",
      imageType: "jpg",
      readyInMinutes: 30,
      servings: 2,
    });
  });

  it("should fallback to empty or 0 when values missing", () => {
    const result = mapSpoonacularMeal({ id: 0 });
    expect(result).toEqual({
      sourceId: "0",
      recipeId: "",
      title: "",
      image: "",
      imageType: "",
      readyInMinutes: 0,
      servings: 0,
    });
  });
});
