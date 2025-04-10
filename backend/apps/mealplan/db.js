import {DailyMealPlan,WeeklyMealPlan } from "../../libraries/models/mealPlans.js";
import { prepareWeeklyDailyPlans ,formatWeeklyMealPlans} from "./utils/weeklyHelper.js";
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


  // Check for a daily plan or overlapping weekly plan on the given date
  export const getDailyOverlaps = async (firebaseUid, date) => {
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
  
    const dailyPlans = await DailyMealPlan.find({
      firebaseUid,
      'dailyMealPlans.startDate': {
        $gte: dayStart,
        $lte: dayEnd
      }
    }).lean();
  
    const weeklyPlans = await WeeklyMealPlan.find({
      firebaseUid,
      'weeklyMealPlans.startDate': { $lte: dayEnd },
      'weeklyMealPlans.endDate': { $gte: dayStart }
    }).lean();
  
    return {dailyPlans, weeklyPlans};
  };
  
  
  // Check for any daily or weekly plans that overlap the 7-day span
  export const getWeeklyOverlaps = async (firebaseUid, startDate) => {
    const start = new Date(startDate.setHours(0, 0, 0, 0));
    const end = new Date(start.getTime() + 6 * 86400000);
    end.setHours(23, 59, 59, 999);
  
    const dailyPlans = await DailyMealPlan.find({
      firebaseUid,
      'dailyMealPlans.startDate': {
        $gte: start,
        $lte: end
      }
    }).lean();
  
    const weeklyPlans = await WeeklyMealPlan.find({
      firebaseUid,
      'weeklyMealPlans.startDate': { $lte: end },
      'weeklyMealPlans.endDate': { $gte: start }
    }).lean();
  
    return {dailyPlans, weeklyPlans};
  };
  
  





  export const fetchUserDailyPlans = async (firebaseUid) => {
    const plans = await DailyMealPlan.find({ firebaseUid }).lean();
    return plans.flatMap(p => p.dailyMealPlans);
  };


  export const fetchUserWeeklyPlans = async (firebaseUid) => {
    const plans = await WeeklyMealPlan.find({ firebaseUid }).lean();
    return plans.flatMap(formatWeeklyMealPlans);
  };

  export const findDailyPlanById = async (planId, uid) => {
    return DailyMealPlan.findOne({ _id: planId, firebaseUid: uid }).lean();
  };

  export const findWeeklyPlanById = async (planId, uid) => {
    const doc = await WeeklyMealPlan.findOne({ _id: planId, firebaseUid: uid }).lean();
    const formatted = formatWeeklyMealPlans(doc);
    return formatted[0] || null;
  };

  export const deleteDailyPlanById = async (planId, uid) => {
    return await DailyMealPlan.deleteOne({ _id: planId, firebaseUid: uid });
  };
  
  export const deleteWeeklyPlanById = async (planId, uid) => {
    return await WeeklyMealPlan.deleteOne({ _id: planId, firebaseUid: uid });
  };
  
  export const deleteAllUserMealPlans = async (uid) => {
    await DailyMealPlan.deleteMany({ firebaseUid: uid });
    await WeeklyMealPlan.deleteMany({ firebaseUid: uid });
  };
    