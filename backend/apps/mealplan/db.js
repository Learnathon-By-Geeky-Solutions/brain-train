import {DailyMealPlan,WeeklyMealPlan } from "../../libraries/models/mealPlans.js";
import { mapSpoonacularWeekToDates } from "./utils/dateHelper.js";

export const saveDailyMealPlan = async (firebaseUid, plan, startDate,customTitle) => {
    const title = customTitle || `Daily Plan - ${startDate.toLocaleDateString()}`;
    const newDailyPlan = new DailyMealPlan({
      firebaseUid,
      dailyMealPlans: [
        {
          title,
          mealPlan: {
            meals: plan.meals,
            nutrients: plan.nutrients
          },
          startDate,              // basically the date of the meal plan
          savedAt: new Date()
        }
      ]
    });
  
    await newDailyPlan.save();
    return plan;
  };
  
 export const saveWeeklyMealPlan = async (firebaseUid, plan, startDate,customTitle) => {
    const title = customTitle || `Weekly Plan - ${startDate.toLocaleDateString()}`;
    const endDate = new Date(startDate.getTime() + 6 * 86400000);
    const dailyPlans = mapSpoonacularWeekToDates(plan.week, startDate); // Returns objects with correct format

    console.log("dailyPlans", dailyPlans);
  
    const newWeeklyPlan = new WeeklyMealPlan({
      firebaseUid,
      weeklyMealPlans: [
        {
          title,
          dailyMealPlans: dailyPlans, 
          startDate,
          endDate,
          savedAt: new Date()
        }
      ]
    });
  
    await newWeeklyPlan.save();
    return plan;
  };
  