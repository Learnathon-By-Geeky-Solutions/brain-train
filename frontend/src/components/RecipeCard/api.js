import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
  
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const handleRecipeDetail = async (id,navigate) => {
    //   const navigate = useNavigate();
      try {
        const idToken = await getAuth().currentUser.getIdToken(true);
        const response = await fetch(`${API_BASE_URL}/search/recipes/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`,
            },
        });

        const data = await response.json();
        if (response.ok) {
            navigate('/dashboard/recipe', { state: { recipe: data } });
        } else {
            console.error('Failed to fetch recipes. Error code:', response.status);
        }
      } catch (err) {
          console.error("Error from central search frame", err.message);
      }
  };

export default handleRecipeDetail;