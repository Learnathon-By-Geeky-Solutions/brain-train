import axios from 'axios';

const SPOONACULAR_API_BASE_URL = 'https://api.spoonacular.com';
const API_KEY = process.env.SPOONACULAR_API_KEY;

export const spoonacularRequest = async (endpoint, params = {}) => {
    try {

        const response = await axios.get(`${SPOONACULAR_API_BASE_URL}${endpoint}`, {
            params: { apiKey: API_KEY, ...params },
        });
        return response.data;
    } catch (error) {
        console.error(`[Spoonacular API Error] ${error.message}`);
        console.error(`[Error Details]`, error.response?.data || {});
        throw new Error(error.response?.data?.message || 'Spoonacular API request failed');
    }
};

