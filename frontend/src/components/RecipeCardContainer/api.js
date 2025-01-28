const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

import { getAuth } from "firebase/auth";

async function removeFavoriteRecipe(recipe) {
    const auth = getAuth();
    const user = auth.currentUser;

    let data = {status: "error", msg: ""};
    const url = `${API_BASE_URL}/favourites/removeRecipe`;
  
    if (user) {
      const idToken = await user.getIdToken(); // Get the ID token
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`, // Send the token in the Authorization header
        },
        body: JSON.stringify(
            {
                "spoonacularId": recipe?.id,
                "title": recipe?.title,
                "image": recipe?.image,
                "source": "spoonacular",
                "likes": recipe?.likes
            }
        )
      });

      if (response.ok) {
        data.status = "success";
      } else {
        data.msg = "Failed to remove favorite recipe";
      }
    } else {
        data.msg = "User not logged in";
    }
    return data;
}

export default removeFavoriteRecipe;
  
