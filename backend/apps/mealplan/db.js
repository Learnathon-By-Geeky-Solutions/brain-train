import {DailyMealPlan,WeeklyMealPlan } from "../../libraries/models/mealPlans.js";
import { prepareWeeklyDailyPlans ,indexByWeekday} from "./utils/weeklyHelper.js";
import { enrichMealsWithRecipeIds } from "./utils/detailsHelper.js";

export const saveDailyMealPlan = async (firebaseUid, plan, startDate,customTitle) => {
    const meals = await enrichMealsWithRecipeIds(plan.meals);
    const newDailyPlan = new DailyMealPlan({
      firebaseUid,
      dailyMealPlans: [
        {
          title: customTitle || `Daily Plan - ${startDate.toLocaleDateString()}`,
          mealPlan: {
            meals,
            nutrients: plan.nutrients
          },
          startDate,              // basically the date of the meal plan
          savedAt: new Date()
        }
      ]
    });
  
    await newDailyPlan.save();
    return newDailyPlan;
  };
  
 export const saveWeeklyMealPlan = async (firebaseUid, plan, startDate,customTitle) => {
    const endDate = new Date(startDate.getTime() + 6 * 86400000);
    const dailyPlansArray = await prepareWeeklyDailyPlans(plan.week, startDate); // For saving to DB

    const newWeeklyPlan = new WeeklyMealPlan({
      firebaseUid,
      weeklyMealPlans: [
        {
          title: customTitle || `Weekly Plan - ${startDate.toLocaleDateString()}`,
          dailyMealPlans: dailyPlansArray, 
          startDate,
          endDate,
          savedAt: new Date()
        }
      ]
    });
  
    await newWeeklyPlan.save();
    return newWeeklyPlan;
  };
  export const fetchUserDailyPlans = async (firebaseUid) => {
    const plans = await DailyMealPlan.find({ firebaseUid }).lean();
    return plans.flatMap(p => p.dailyMealPlans);
  };
  export const fetchUserWeeklyPlans = async (firebaseUid) => {
    const plans = await WeeklyMealPlan.find({ firebaseUid }).lean();
  
    return plans.flatMap(weeklyDoc => {
      if (!weeklyDoc.weeklyMealPlans || weeklyDoc.weeklyMealPlans.length === 0) return [];
  
      return weeklyDoc.weeklyMealPlans.map(entry => ({
        _id: weeklyDoc._id,
        title: entry.title,
        startDate: entry.startDate,
        endDate: entry.endDate,
        savedAt: entry.savedAt,
        plansByWeekday: indexByWeekday(entry.dailyMealPlans || [])
      }));
    });
  };
  