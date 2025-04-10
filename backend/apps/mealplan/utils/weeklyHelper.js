


import { enrichMealsWithRecipeIds } from './detailsHelper.js';

export const prepareWeeklyDailyPlans = async (weekData, startDate) => {
  const weekdays = Object.keys(weekData); // 'monday' → 'sunday'

  const dailyPlans = await Promise.all(weekdays.map(async (day, index) => {
    const plan = weekData[day];
    const actualDate = new Date(startDate.getTime() + index * 86400000);

    const enrichedMeals = await enrichMealsWithRecipeIds(plan.meals);

    return {
      title: `Meal Plan - ${actualDate.toLocaleDateString('en-US', { weekday: 'long' })}`,
      startDate: actualDate,
      mealPlan: {
        meals: enrichedMeals,
        nutrients: Object.entries(plan.nutrients).map(([name, amount]) => ({
          name,
          amount,
          unit: guessUnit(name)
        }))
      }
    };
  }));

  return dailyPlans;
};

const guessUnit = (name) => {
  if (name === 'calories') return 'kcal';
  if (['protein', 'fat', 'carbohydrates'].includes(name)) return 'g';
  return '';
};

// Helper to index daily plans by weekday
export const indexByWeekday = (dailyMealPlans) => {
  const indexed = {};

  dailyMealPlans.forEach(daily => {
    if (!daily?.startDate) return;
    const weekday=daily.startDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    indexed[weekday] = daily;
  });

  return indexed;
};

export const formatWeeklyMealPlans = (weeklyDoc) => {
  if (!weeklyDoc?.weeklyMealPlans) return [];

  return weeklyDoc.weeklyMealPlans.map(entry => ({
    _id: weeklyDoc._id,
    title: entry.title,
    startDate: entry.startDate,
    endDate: entry.endDate,
    savedAt: entry.savedAt,
    plansByWeekday: indexByWeekday(entry.dailyMealPlans || [])
  }));
};