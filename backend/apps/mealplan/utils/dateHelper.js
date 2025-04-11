

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
            title: weekly.title,
            startDate: weekly.startDate,
            endDate: weekly.endDate
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