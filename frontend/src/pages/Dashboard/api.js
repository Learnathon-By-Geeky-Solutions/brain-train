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
  let url = handleFilters(
    `${API_BASE_URL}/search/recipes?query=${searchData.data}&fields=summary,likes,title,image`,
    searchData
  );
  return url;
}

// function handleFilters (url, searchData) {
//   for (const filter of searchData.filters) {
//     if(filter.cuisine){
//       url += `&cuisine=${filter.cuisine}`;
//     }
//     if(filter.diet && filter.diet.length > 0){
//       for (const diet of filter.diet) {
//         if(diet === "Vegetarian"){
//           url += '&vegetarian=true';
//         }
//         else if(diet === "Vegan"){
//           url += '&vegan=true';
//         }
//         else if(diet === "Gluten Free"){
//           url += '&glutenFree=true';
//         }
//         else if(diet === "Dairy Free"){
//           url += '&dairyFree=true';
//         }
//       }
//     }
//     if(filter.rangeFilters && filter.rangeFilters.length > 0){
//       for (const rangeFilter of filter.rangeFilters) {
//         url += `&min${rangeFilter.type}=${rangeFilter.min}&max${rangeFilter.type}=${rangeFilter.max}`;
//       }
//     }
//   }
//   return url;
// }

function handleFilters(url, searchData) {
  if (!searchData.filters?.length) {
    return url;
  }

  for (const filter of searchData.filters) {
    url = appendCuisineFilter(url, filter);
    url = appendDietFilters(url, filter);
    url = appendRangeFilters(url, filter);
  }
  
  return url;
}

function appendCuisineFilter(url, filter) {
  if (filter.cuisine) {
    url += `&cuisine=${filter.cuisine}`;
  }
  return url;
}

function appendDietFilters(url, filter) {
  if (!filter.diet || filter.diet.length === 0) {
    return url;
  }
  
  const dietMappings = {
    "Vegetarian": "vegetarian",
    "Vegan": "vegan",
    "Gluten Free": "glutenFree",
    "Dairy Free": "dairyFree"
  };
  
  for (const diet of filter.diet) {
    const paramName = dietMappings[diet];
    if (paramName) {
      url += `&${paramName}=true`;
    }
  }
  
  return url;
}

function appendRangeFilters(url, filter) {
  if (!filter.rangeFilters || filter.rangeFilters.length === 0) {
    return url;
  }
  
  for (const rangeFilter of filter.rangeFilters) {
    url += `&min${rangeFilter.type}=${rangeFilter.min}&max${rangeFilter.type}=${rangeFilter.max}`;
  }
  
  return url;
}

const handleSearchByIngredients = (searchData) => {
    let ingredients = '';
    let data = searchData.data;
    data.fields.forEach((field) => {
        ingredients += field.name + ',';
    });
    ingredients = ingredients.slice(0, -1);
    return handleFilters(`${API_BASE_URL}/search/recipes/ingredients?ingredients=${ingredients}&fields=summary,likes,title,image`, searchData);
}

const fetchData = async (searchData) => {

    let url = "";

    if (searchData.type === "title") {
      url = handleSearchByTitle(searchData);
      console.log('url from fetchData '+url);
    } else if (searchData.type === "ingredients") {
      url = handleSearchByIngredients(searchData);
      console.log('url from fetchData '+url);
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const idToken = await user.getIdToken(true);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
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