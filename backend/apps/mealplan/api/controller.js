import { spoonacularRequest } from '../../../libraries/services/spoonacular.js';
import { decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';

// Controller: Search Recipes by Ingredients
export const planMeal = async (req, res) => {
    try {
        // await decodeFirebaseIdToken(req.headers.authorization);
        
        
        let { timeFrame,...params } = req.query ;
        timeFrame = timeFrame || 'day';
        console.log("timeFrame", timeFrame);
        console.log("🔍 Searching plan for...", params);
        
        const plan = await spoonacularRequest('/mealplanner/generate', { timeFrame, ...params });
        return res.status(200).json({ results: plan });


    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};