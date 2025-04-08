export const mapSpoonacularWeekToDates = (spoonacularWeek, startDate) => {
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dailyPlans = [];
  
    for (let i = 0; i < dayKeys.length; i++) {
      const key = dayKeys[i];
      const dayPlan = spoonacularWeek[key];
  
      if (!dayPlan) continue;
  
      const date = new Date(startDate.getTime() + i * 86400000);
  
      dailyPlans.push({
        planDate: date,
        meals: dayPlan.meals,
        nutrients: [dayPlan.nutrients]
      });
    }
  
    return dailyPlans;
  };
  