export const summarizePlans = (planDocs, type = 'week') => {
    const fieldName = type === 'week' ? 'weeklyMealPlans' : 'dailyMealPlans';
    return planDocs.flatMap(doc =>
      (doc?.[fieldName] || []).map(entry => ({
        _id: doc._id,  // or entry._id if you want subdocument ID
        title: entry.title,
        startDate: entry.startDate,
        ...(type === 'week' && { endDate: entry.endDate }),
        savedAt: entry.savedAt
      }))
    );
  };