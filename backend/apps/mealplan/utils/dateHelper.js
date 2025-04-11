

export const extractMatchingDailyPlansFromWeekly = (weeklyDocs, dayStart, dayEnd) => {
    const matchedPlans = [];
  
    for (const doc of weeklyDocs) {
      for (const weekly of doc.weeklyMealPlans) {
        const matches = weekly.dailyMealPlans
          .filter(dp => {
            const date = new Date(dp.startDate);
            return date >= dayStart && date <= dayEnd;
          })
          .map(dp => ({
            ...dp,
            source: 'weekly',
            weeklyStartDate: weekly.startDate,
            weeklyTitle: weekly.title,
            weeklyEndDate: weekly.endDate
          }));
  
        matchedPlans.push(...matches);
      }
    }
  
    return matchedPlans;
  };
  
  export const extractMatchingDailyPlansFromDaily = (dailyDocs, dayStart, dayEnd) => {
    const matchedPlans = [];
  
    for (const doc of dailyDocs) {
      const matches = doc.dailyMealPlans
        .filter(dp => {
          const dpDate = new Date(dp.startDate);
          return dpDate >= dayStart && dpDate <= dayEnd;
        })
        .map(dp => ({
          ...dp,
          source: 'daily'
        }));
  
      matchedPlans.push(...matches);
    }
  
    return matchedPlans;
  };
  export const buildWeekIndexedPlans = (start, plansByDate) => {
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const result = {};
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const key = date.toDateString();
      const weekday = weekdays[date.getDay()];
      result[weekday] = plansByDate[key] || null;
    }
  
    return result;
  };
  export const groupPlansByDate = (plansArray) => {
    const result = {};
    for (const plan of plansArray) {
      const date = new Date(plan.startDate);

      result[date.toDateString()] = plan;
    }
    return result;
  };
  