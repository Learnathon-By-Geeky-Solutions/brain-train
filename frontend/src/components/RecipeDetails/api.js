const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

import { getAuth } from "firebase/auth";

async function addToFavourites(recipe) {
    const auth = getAuth();
    const user = auth.currentUser;

    let data = {status: "error", msg: ""};
    const url = `${API_BASE_URL}/favourites/addRecipe`;
  
    if (user) {
      const idToken = await user.getIdToken(); // Get the ID token
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`, // Send the token in the Authorization header
        },
        body: JSON.stringify(
            {
                "recipeId": recipe?._id,
            }
        )
      });

      if (response.ok) {
        data.status = "success";
      } else {
        data.msg = "Failed to add favorite recipe";
      }
    } else {
        data.msg = "User not logged in";
    }
    return data;
}

export default addToFavourites;