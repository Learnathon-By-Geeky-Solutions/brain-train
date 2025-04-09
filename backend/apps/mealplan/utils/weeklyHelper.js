import { enrichMealsWithRecipeIds } from './detailsHelper.js';

const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * Converts Spoonacular weekly meal plan into an object indexed by weekday.
 * Dynamically calculates the true weekday based on the given start date.
 *
 * @param {Object} weekData - Spoonacular response under `results.week`
 * @param {Date} startDate - The actual user-selected start date
 * @returns {Object} - { monday: { title, startDate, mealPlan }, ... }
 */
export const generateIndexedWeeklyMealPlans = async (weekData, startDate) => {
  const indexedPlans = {};

  const spoonWeekdays = Object.keys(weekData); // ['monday', 'tuesday', ...]
  for (let i = 0; i < spoonWeekdays.length; i++) {
    const spoonDay = spoonWeekdays[i];
    const plan = weekData[spoonDay];
    const currentDate = new Date(startDate.getTime() + i * 86400000);
    const actualWeekday = dayNames[currentDate.getDay()]; // true weekday of custom startDate + offset

    const enrichedMeals = await enrichMealsWithRecipeIds(plan.meals);

    indexedPlans[actualWeekday] = {
      title: `Meal Plan - ${capitalize(actualWeekday)}`,
      startDate: currentDate,
      mealPlan: {
        meals: enrichedMeals,
        nutrients: Object.entries(plan.nutrients).map(([name, amount]) => ({
          name,
          amount,
          unit: guessUnit(name)
        }))
      }
    };
  }

  return indexedPlans;
};

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const guessUnit = (name) => {
  if (name === 'calories') return 'Calories';
  if (['protein', 'fat', 'carbohydrates'].includes(name)) return 'g';
  return '';
};
