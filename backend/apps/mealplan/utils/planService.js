import { spoonacularRequest } from '../../../libraries/services/spoonacular.js';
import { saveDailyMealPlan, saveWeeklyMealPlan ,getDailyOverlaps,getWeeklyOverlaps,
  getDailyPlansOnDate, getWeeklyPlansOnDate
 } from '../db.js';
import { extractMatchingDailyPlansFromDaily, extractMatchingDailyPlansFromWeekly } from './dateHelper.js';

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
  
  // Function to extract matching daily plans from daily and weekly results,on the specified date
  export const searchDailyPlansByDate = async (firebaseUid, date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
  
    const dailyResults = await getDailyPlansOnDate(firebaseUid, dayStart, dayEnd);
    const weeklyResults = await getWeeklyPlansOnDate(firebaseUid, dayStart, dayEnd);
  
    const dailyMatches = extractMatchingDailyPlansFromDaily(dailyResults, dayStart, dayEnd);
    const weeklyMatches = extractMatchingDailyPlansFromWeekly(weeklyResults, dayStart, dayEnd);
  
    return [...dailyMatches, ...weeklyMatches];
  };
  