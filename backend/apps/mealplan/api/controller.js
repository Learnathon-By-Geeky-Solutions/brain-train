import { decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';
import { generateMealPlanAndSave } from '../utils/planService.js';
import { fetchUserDailyPlans, fetchUserWeeklyPlans,findDailyPlanById,findWeeklyPlanById } from '../db.js';



export const planMeal = (req, res) => {
    decodeFirebaseIdToken(req.headers.authorization)
      .then(({ uid }) => generateMealPlanAndSave(uid, req.body))
      .then(plan => res.status(201).json({ success: true, plan }))
      .catch(error => {
        console.error(' Meal planning error:', error.message);
        return res.status(500).json({success:false, error: 'Internal server error' });
      });
  };

  export const viewMealPlans = (req, res) => {
    decodeFirebaseIdToken(req.headers.authorization)
      .then(({ uid }) => {
        const { type } = req.query;
        const response = {};
  
        const dailyPromise = !type || type === 'day' ? fetchUserDailyPlans(uid) : Promise.resolve(null);
        const weeklyPromise = !type || type === 'week' ? fetchUserWeeklyPlans(uid) : Promise.resolve(null);
  
        return Promise.all([dailyPromise, weeklyPromise])
          .then(([dailyPlans, weeklyPlans]) => {
            if (dailyPlans) response.dailyPlans = dailyPlans;
            if (weeklyPlans) response.weeklyPlans = weeklyPlans;
            res.status(200).json({ success: true, ...response });
          });
      })
      .catch(error => {
        console.error('[MealPlans] View Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch meal plans.' });
      });
  };
  

  
export const viewMealPlanById = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => {
      const { planId } = req.params;
      const { type } = req.query;

      if (!planId || !type || !['day', 'week'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Invalid plan type or ID.' });
      }

      const fetchFn = type === 'day' ? findDailyPlanById : findWeeklyPlanById;

      return fetchFn(planId, uid).then(plan => {
        if (!plan) {
          return res.status(404).json({ success: false, message: 'Meal plan not found.' });
        }

        return res.status(200).json({ success: true, plan });
      });
    })
    .catch(err => {
      console.error('[MealPlans] Single View Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch meal plan.' });
    });
};



