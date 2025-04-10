import { spoonacularRequest } from '../../../libraries/services/spoonacular.js';
import { saveDailyMealPlan, saveWeeklyMealPlan ,getDailyOverlaps,getWeeklyOverlaps } from '../db.js';

export const generateMealPlanAndSave = async (firebaseUid, body) => {
    const {
      timeFrame = 'day',
      startDate,
      title,
      ...params
    } = body;

    const parsedStartDate = startDate ? new Date(startDate) : new Date();
    const conflict =
    timeFrame === 'day'
      ? await getDailyOverlaps(firebaseUid, parsedStartDate)
      : await getWeeklyOverlaps(firebaseUid, parsedStartDate);

    if (
      conflict.dailyPlans?.length > 0 ||
      conflict.weeklyPlans?.length > 0
    ) {
      return {
        success: false,
        existing: true,
        existingPlans: conflict
      };
    }

    const plan = await spoonacularRequest('/mealplanner/generate', {
      timeFrame,
      ...params
    });
  
    if (timeFrame === 'day') {
      const saved = await saveDailyMealPlan(firebaseUid, plan, parsedStartDate, title);
      return { success: true, plan: saved };
    }
    else if (timeFrame === 'week') {
      const saved = await saveWeeklyMealPlan(firebaseUid, plan, parsedStartDate, title);
      return { success: true, plan: saved };
    } else {
      throw new Error('Invalid timeFrame');
    }
  };
  