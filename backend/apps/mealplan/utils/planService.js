import { spoonacularRequest } from "../../../libraries/services/spoonacular.js";
import {
  saveDailyMealPlan,
  saveWeeklyMealPlan,
  getDailyOverlaps,
  getWeeklyOverlaps,
  getDailyPlansOnDateRange,
  getWeeklyPlansInRange,
  deleteDailyPlanById,
  deleteWeeklyPlanById,
} from "../db.js";
import {
  extractMatchingDailyPlansFromDaily,
  extractMatchingDailyPlansFromWeekly,
  groupPlansByDate,
  buildWeekIndexedPlans,
} from "./dateHelper.js";

const checkConflicts = (uid, frame, date) => {
  return frame === "day"
    ? getDailyOverlaps(uid, date)
    : getWeeklyOverlaps(uid, date);
};

const hasConflicts = (conflict) =>
  conflict.dailyPlans?.length > 0 || conflict.weeklyPlans?.length > 0;

const savePlan = (uid, plan, date, title, frame) =>
  frame === "day"
    ? saveDailyMealPlan(uid, plan, date, title)
    : saveWeeklyMealPlan(uid, plan, date, title);

export const generateMealPlanAndSave = async (firebaseUid, body) => {
  const {
    timeFrame = "day",
    startDate,
    title,
    deleteOverlap = false,

    ...params
  } = body;

  const parsedStartDate = startDate ? new Date(startDate) : new Date();
  const conflict = await checkConflicts(
    firebaseUid,
    timeFrame,
    parsedStartDate,
  );
  if (hasConflicts(conflict)) {
    if (deleteOverlap) {
      await deleteOverlappingPlans(firebaseUid, conflict); //  continue with the plan generation after deletion of the overlapping plans
    } else {
      return {
        success: false,
        existing: true,
        existingPlans: conflict,
      };
    }
  }
  const generated = await spoonacularRequest("/mealplanner/generate", {
    timeFrame,
    ...params,
  });

  const saved = await savePlan(
    firebaseUid,
    generated,
    parsedStartDate,
    title,
    timeFrame,
  );
  return { success: true, plan: saved };
};

// Function to extract matching daily plans from daily and weekly results,on the specified date
export const searchPlansByDateOrRange = async (firebaseUid, dateStr, type) => {
  const start = new Date(dateStr);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  if (type === "week") {
    end.setDate(start.getDate() + 6);
  }
  end.setHours(23, 59, 59, 999);

  const [dailyDocs, weeklyDocs] = await Promise.all([
    getDailyPlansOnDateRange(firebaseUid, start, end),
    getWeeklyPlansInRange(firebaseUid, start, end),
  ]);

  const dailyPlans = extractMatchingDailyPlansFromDaily(dailyDocs, start, end);
  const weeklyPlans = extractMatchingDailyPlansFromWeekly(
    weeklyDocs,
    start,
    end,
  );

  const dailyMap = groupPlansByDate(dailyPlans);
  const weeklyMap = groupPlansByDate(weeklyPlans);

  const combinedMap = { ...weeklyMap, ...dailyMap }; // daily takes priority
  console.log("combinedMap", combinedMap);
  if (type === "day") {
    console.log("day", start.toDateString(), combinedMap[start.toDateString()]);
    return combinedMap[start.toDateString()]
      ? [combinedMap[start.toDateString()]]
      : [];
  }

  return buildWeekIndexedPlans(start, combinedMap);
};

export const deleteOverlappingPlans = async (firebaseUid, existingPlans) => {
  const { dailyPlans, weeklyPlans } = existingPlans;
  const dailyPromises = dailyPlans.map((plan) =>
    deleteDailyPlanById(plan._id, firebaseUid),
  );
  const weeklyPromises = weeklyPlans.map((plan) =>
    deleteWeeklyPlanById(plan._id, firebaseUid),
  );

  await Promise.all([...dailyPromises, ...weeklyPromises]);
  return {
    success: true,
    deleted: { daily: dailyPlans.length, weekly: weeklyPlans.length },
  };
};
