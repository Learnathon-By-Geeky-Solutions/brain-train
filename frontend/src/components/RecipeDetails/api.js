const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

import { getAuth, onAuthStateChanged } from "firebase/auth";

async function addToFavourites(recipe) {
  const auth = getAuth();
  const user = auth.currentUser;

  let data = { status: "error", msg: "" };
  const url = `${API_BASE_URL}/favourites/addRecipe`;

  if (user) {
    const idToken = await user.getIdToken(); // Get the ID token
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`, // Send the token in the Authorization header
      },
      body: JSON.stringify({
        recipeId: recipe?._id,
      }),
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

async function getShoppingList(servingSize, id) {
  const auth = getAuth();
  let data = { status: "error", msg: "" };
  const url = `${API_BASE_URL}/search/recipes/${id}/shoppingList?requestedServing=${servingSize}`;

  // Return a promise that resolves when auth state is ready
  return new Promise((resolve) => {
    // This listener fires once when auth state is first determined
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Stop listening immediately after first auth state is determined

      if (user) {
        const idToken = await user.getIdToken();
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          data = await response.json();
        } else {
          data.msg = "Failed to get shopping list";
        }
      } else {
        data.msg = "User not logged in";
      }

      resolve(data);
    });
  });
}

export default addToFavourites;
export { getShoppingList };
