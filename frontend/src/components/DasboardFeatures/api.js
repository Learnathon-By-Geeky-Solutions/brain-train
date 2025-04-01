import { getAuth,onAuthStateChanged } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const getRecentRecipes = async(noOfRecipes)=>{
    console.log("Getting recent recipes");
  const auth = getAuth();
  let data = {status: "error", msg: ""};
  const url = `${API_BASE_URL}/search/history/${noOfRecipes}`;
  
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
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        });
        
        if (response.ok) {
          data = await response.json();
        } else {
          data.msg = "Failed to get recent recipes";
        }
      } else {
        data.msg = "User not logged in";
      }
      console.log("Data: ", data);
      resolve(data);
    });
  });
}


export { getRecentRecipes };