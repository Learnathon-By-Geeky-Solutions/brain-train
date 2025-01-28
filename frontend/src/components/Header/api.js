const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

import { getAuth } from "firebase/auth";

async function getFavoriteRecipes() {
    const auth = getAuth();
    const user = auth.currentUser;

    let data = {recipes: [], status: "error", msg: ""};
    const url = `${API_BASE_URL}/favourites/list`;
  
    if (user) {
      const idToken = await user.getIdToken(); // Get the ID token
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`, // Send the token in the Authorization header
        },
      });

      if (response.ok) {
        const rawData = await response.json();
        data.recipes = rawData.results;
        data.status = "success";
      } else {
        data.msg = "Failed to fetch favorite recipes";
      }
    } else {
        data.msg = "User not logged in";
    }
    return data;
}

export default getFavoriteRecipes;
  
