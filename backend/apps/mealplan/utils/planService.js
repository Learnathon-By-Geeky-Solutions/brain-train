import { spoonacularRequest } from '../../../libraries/services/spoonacular.js';
import { saveDailyMealPlan, saveWeeklyMealPlan ,getDailyOverlaps,getWeeklyOverlaps } from '../db.js';



const checkConflicts = (uid, frame, date) => {
  return frame === 'day'
    ? getDailyOverlaps(uid, date)
    : getWeeklyOverlaps(uid, date);
};

const hasConflicts = (conflict) =>
  conflict.dailyPlans?.length > 0 || conflict.weeklyPlans?.length > 0;

const savePlan = (uid, plan, date, title, frame) =>
  frame === 'day'
    ? saveDailyMealPlan(uid, plan, date, title)
    : saveWeeklyMealPlan(uid, plan, date, title);

export const generateMealPlanAndSave = async (firebaseUid, body) => {
    const {
      timeFrame = 'day',
      startDate,
      title,
      ...params
    } = body;

    const parsedStartDate = startDate ? new Date(startDate) : new Date();

    const conflict = await checkConflicts(firebaseUid, timeFrame, parsedStartDate);
    if (hasConflicts(conflict)) {
      return {
        success: false,
        existing: true,
        existingPlans: conflict
      };
    }


    const generated = await spoonacularRequest('/mealplanner/generate', {
      timeFrame,
      ...params
    });
  
    const saved = await savePlan(firebaseUid, generated, parsedStartDate, title, timeFrame);
    return { success: true, plan: saved };
  };
  
  