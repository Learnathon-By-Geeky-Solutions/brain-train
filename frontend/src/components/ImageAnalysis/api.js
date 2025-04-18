const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

import fetchData from "@/pages/Dashboard/api";
import makeRequest from "@/services/APIcall";

// Mock API function to simulate image upload with progress
async function uploadImageWithProgressIngredients(file){
   const url = `${API_BASE_URL}/ai/analyze/ingredients`;
   const reqBody = new FormData();
   reqBody.append("image", file);
   return makeRequest(url, "POST", reqBody);
};

async function uploadImageWithProgressNutrition(file) {
  const url = `${API_BASE_URL}/ai/analyze/food`;
   const reqBody = new FormData();
   reqBody.append("image", file);
   return makeRequest(url, "POST", reqBody);
};

export {uploadImageWithProgressIngredients, uploadImageWithProgressNutrition};