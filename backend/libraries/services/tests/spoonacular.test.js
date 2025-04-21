import { jest } from "@jest/globals";
import dotenv from "dotenv";

dotenv.config();

const mockGet = jest.fn();
jest.unstable_mockModule("axios", () => ({
  default: {
    get: mockGet,
  },
}));

describe("spoonacularRequest", () => {
  const validKey = "test-key";
  const testEndpoint = "/recipes/random";
  const testParams = { number: 2 };

  beforeEach(() => {
    process.env.SPOONACULAR_API_KEY = validKey;
    mockGet.mockReset();
  });

  it("should format endpoint without slash", async () => {
    const { spoonacularRequest } = await import("../spoonacular.js");
    mockGet.mockResolvedValue({ data: { success: true } });

    const res = await spoonacularRequest("recipes/random");
    expect(mockGet).toHaveBeenCalledWith(
      "https://api.spoonacular.com/recipes/random",
      { params: { apiKey: validKey } },
    );
    expect(res).toEqual({ success: true });
  });

  it("should make request and return data (success)", async () => {
    const { spoonacularRequest } = await import("../spoonacular.js");
    mockGet.mockResolvedValue({ data: { foo: "bar" } });

    const data = await spoonacularRequest(testEndpoint, testParams);
    expect(mockGet).toHaveBeenCalledWith(
      "https://api.spoonacular.com/recipes/random",
      { params: { apiKey: validKey, ...testParams } },
    );
    expect(data).toEqual({ foo: "bar" });
  });

  it("should handle Spoonacular API errors with message", async () => {
    const { spoonacularRequest } = await import("../spoonacular.js");
    mockGet.mockRejectedValue({
      message: "Request failed",
      response: { data: { message: "Quota exceeded" } },
    });

    await expect(spoonacularRequest(testEndpoint)).rejects.toThrow(
      "Quota exceeded",
    );
  });

  it("should handle Spoonacular API errors without response message", async () => {
    const { spoonacularRequest } = await import("../spoonacular.js");
    mockGet.mockRejectedValue({
      message: "Network error",
      response: {},
    });

    await expect(spoonacularRequest(testEndpoint)).rejects.toThrow(
      "Spoonacular API request failed",
    );
  });

  it("should throw if API key is not provided in environment", async () => {
    delete process.env.SPOONACULAR_API_KEY;
    jest.resetModules();
    await expect(async () => {
      await import("../spoonacular.js");
    }).rejects.toThrow("SPOONACULAR_API_KEY IS REQUIRED");
  });
});
