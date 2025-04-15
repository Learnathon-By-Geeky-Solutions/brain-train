import { getAuth,onAuthStateChanged } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

async function makeRequest(url, method, body) {
  const auth = getAuth();
  let data = { status: "error", msg: "" };
  // Return a promise that resolves when auth state is ready
  return new Promise((resolve) => {
    // This listener fires once when auth state is first determined
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Stop listening immediately after first auth state is determined
      if (user) {
        const idToken = await user.getIdToken();
        const req = {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
        if(body){
          req.body = JSON.stringify(body);
        }
        const response = await fetch(url, req);
        if (response.ok) {
          data = await response.json();
          console.log("res ok from makeRequest");
          console.log(data);
        }
        else if(response.status === 409){
          data.msg = "overlap";
          data.res = await response.json();
          console.log("overlap from makeRequest");
          console.log(data);
        }
        else {
          console.log("res not ok from makeRequest");
          data.msg = "Failed to make request";
        }
      } else {
        data.msg = "User not logged in";
      }
      resolve(data);
    });
  });
}

const getRecentRecipes = async(noOfRecipes)=>{
  const url = `${API_BASE_URL}/search/history/${noOfRecipes}`;
  return makeRequest(url, "GET", null);
}

const getRecommendedRecipes = async()=>{
  console.log("Getting recommended recipes");
  const url = `${API_BASE_URL}/user/recommended`;
  return makeRequest(url, "GET", null);
}

const getTrendingRecipes = async(noOfRecipes)=>{
  const url = `${API_BASE_URL}/trending/${noOfRecipes}`;
  return makeRequest(url, "GET", null);
}


export { getRecentRecipes, getRecommendedRecipes, getTrendingRecipes };