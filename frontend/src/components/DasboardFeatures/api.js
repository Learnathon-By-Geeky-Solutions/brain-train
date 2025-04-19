import makeRequest from "@/services/APIcall";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const getRecentRecipes = async (noOfRecipes) => {
  const url = `${API_BASE_URL}/search/history/${noOfRecipes}`;
  return makeRequest(url, "GET", null);
};

const getRecommendedRecipes = async () => {
  const url = `${API_BASE_URL}/user/recommended`;
  return makeRequest(url, "GET", null);
};

const getTrendingRecipes = async (noOfRecipes) => {
  const url = `${API_BASE_URL}/trending/${noOfRecipes}`;
  return makeRequest(url, "GET", null);
};

export { getRecentRecipes, getRecommendedRecipes, getTrendingRecipes };
