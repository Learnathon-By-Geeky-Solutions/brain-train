import { decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';
import { generateMealPlanAndSave } from '../utils/planService.js';
import { fetchUserDailyPlans, fetchUserWeeklyPlans } from '../db.js';



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
  



