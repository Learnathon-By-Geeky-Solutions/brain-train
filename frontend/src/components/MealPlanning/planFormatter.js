/**
 * Finds a daily plan that matches the given start date
 * @param {string} startDate - Date in 'yyyy-mm-dd' format
 * @returns {string|number} Plan ID if found, -1 otherwise
 */
function getDayWisePlan(startDate, dailyPlans) {
  // Convert input string date to Date object for comparison
  const searchDate = new Date(startDate);

  // Loop through all daily plans
  for (const plan of dailyPlans) {
    // Convert plan start date to Date object for comparison
    const planDate = new Date(plan.startDate);

    // Check if dates match (ignoring time)
    if (planDate.toDateString() === searchDate.toDateString()) {
      return plan._id;
    }
  }

  // Return -1 if no matching plan found
  return -1;
}

/**
 * Finds a weekly plan where the given date falls between the start and end dates
 * @param {string} startDate - Date in 'yyyy-mm-dd' format
 * @returns {Object|number} Object with id and offset if found, -1 otherwise
 */
function getWeekWisePlan(startDate, weeklyPlans) {
  // Convert input string date to Date object for comparison
  const searchDate = new Date(startDate);
  let plans = [];

  // Loop through all weekly plans
  for (const plan of weeklyPlans) {
    // Convert plan dates to Date objects for comparison
    const planStartDate = new Date(plan.startDate);
    const planEndDate = new Date(plan.endDate);

    // Check if search date falls within the plan's date range
    if (searchDate >= planStartDate && searchDate <= planEndDate) {
      // Calculate offset in days
      const offsetDays = Math.floor(
        (searchDate - planStartDate) / (1000 * 60 * 60 * 24),
      );

      plans.push({
        id: plan._id,
        offset: offsetDays,
      });
    }
  }

  return plans;
}

export { getDayWisePlan, getWeekWisePlan };
