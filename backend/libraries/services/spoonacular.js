import axios from 'axios';

const SPOONACULAR_API_BASE_URL = 'https://api.spoonacular.com';
const API_KEY = process.env.SPOONACULAR_API_KEY || (() => {
    console.error('[ERROR] SPOONACULAR_API_KEY IS NOT DEFINED IN ENVIRONMENT VARIABLES');
    throw new Error('SPOONACULAR_API_KEY IS REQUIRED');
})();

export const spoonacularRequest = async (endpoint, params = {}) => {
    // VALIDATE ENDPOINT FORMAT
    if (!endpoint || typeof endpoint !== 'string') {
        throw new Error('INVALID ENDPOINT: ENDPOINT MUST BE A NON-EMPTY STRING');
    }
    
    // ENSURE ENDPOINT BEGINS WITH SLASH
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    try {
        const response = await axios.get(`${SPOONACULAR_API_BASE_URL}${formattedEndpoint}`, {
            params: { apiKey: API_KEY, ...params },
        });
        return response.data;
    } catch (error) {
        console.error(`[Spoonacular API Error] ${error.message} | ENDPOINT: ${formattedEndpoint}`);
        console.error(`[Error Details]`, error.response?.data || {});
        throw new Error(error.response?.data?.message || 'Spoonacular API request failed');
    }
};
