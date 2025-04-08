import { spoonacularRequest } from '../../../libraries/services/spoonacular.js';
import { saveDailyMealPlan, saveWeeklyMealPlan } from '../db.js';

export const generateMealPlanAndSave = async (firebaseUid, body) => {
    const {
      timeFrame = 'day',
      startDate,
      title,
      ...params
    } = body;
  
    const plan = await spoonacularRequest('/mealplanner/generate', {
      timeFrame,
      ...params
    });
  
    const parsedStartDate = startDate ? new Date(startDate) : new Date();
  
    if (timeFrame === 'day') {
      return saveDailyMealPlan(firebaseUid, plan, parsedStartDate,title);
    } else if (timeFrame === 'week') {
      return saveWeeklyMealPlan(firebaseUid, plan, parsedStartDate,title);
    } else {
      throw new Error('Invalid timeFrame');
    }
  };
  