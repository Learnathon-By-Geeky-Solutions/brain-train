import { getAuth } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

async function getFavoriteRecipes() {
    const auth = getAuth();
    const user = auth.currentUser;
    let data = {recipes: [], status: "error", msg: ""};
    const url = `${API_BASE_URL}/favourites/list`;
  
    if (user) {
      const idToken = await user.getIdToken(true); // Forces a refresh of the token
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`, // Send the token in the Authorization header
        },
      });

      if (response.ok) {
        const rawData = await response.json();
        data.recipes = rawData.recipes;
        data.status = "success";
      } else {
        data.msg = "Failed to fetch favorite recipes";
      }
    } else {
        data.msg = "User not logged in";
    }
    return data;
}

function handleSearchByTitle (searchData) {
    return `${API_BASE_URL}/search/recipes?query=${searchData.data}&fields=summary,likes,title,image`;
}

const handleSearchByIngredients = (searchData) => {
    console.log('searchData from function by ing'+searchData);
    let ingredients = '';
    let data = searchData.data;
    data.fields.forEach((field) => {
        ingredients += field.name + ',';
    });
    ingredients = ingredients.slice(0, -1);
    console.log('url from function '+`${API_BASE_URL}/search/recipes/ingredients?ingredients=${ingredients}&fields=summary,likes,title,image`);
    return `${API_BASE_URL}/search/recipes/ingredients?ingredients=${ingredients}&fields=summary`;
}

const fetchData = async (searchData) => {

    let url = "";

    if (searchData.type === "title") {
      url = handleSearchByTitle(searchData);
    } else if (searchData.type === "ingredients") {
      url = handleSearchByIngredients(searchData);
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${2 + 2}`,
        },
      });
      const data = await response.json();

    if (response.ok)
    return data.results; 
    console.error("Failed to fetch recipes. Error code:", response.status);
      
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
};

export { getFavoriteRecipes };
export default fetchData;