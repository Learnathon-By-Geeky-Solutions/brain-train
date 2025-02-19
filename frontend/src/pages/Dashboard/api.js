const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

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

export default fetchData;