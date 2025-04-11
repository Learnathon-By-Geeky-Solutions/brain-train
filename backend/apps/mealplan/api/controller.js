import { decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';
import { generateMealPlanAndSave,searchPlansByDateOrRange } from '../utils/planService.js';
import { fetchUserDailyPlans, fetchUserWeeklyPlans,findDailyPlanById,findWeeklyPlanById 
  ,deleteDailyPlanById, deleteWeeklyPlanById, deleteAllUserMealPlans
} from '../db.js';


  export const planMeal = (req, res) => {
    decodeFirebaseIdToken(req.headers.authorization)
      .then(({ uid }) => generateMealPlanAndSave(uid, req.body))
      .then(result => {
        if (!result.success) {
          return res.status(409).json(result); // Already exists or failed validation
        }
        return res.status(201).json(result); // Success
      })
      .catch(error => {
        console.error('Meal planning error:', error.message);
        return res.status(500).json({ success: false, error: 'Internal server error' });
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

// DELETE all meal plans of a user
export const deleteAllMealPlans = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => deleteAllUserMealPlans(uid))
    .then(() => {
      res.status(200).json({ success: true, message: 'All meal plans deleted.' });
    })
    .catch(error => {
      console.error('[DeleteAllPlans] Error:', error.message);
      res.status(500).json({ success: false, message: 'Failed to delete all meal plans.' });
    });
};

export const deleteMealPlanById = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => {
      const { planId } = req.params;
      const { type } = req.query;

      console.log('Deleting meal plan:', { planId, type });
      if (!planId || !type || !['day', 'week'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Invalid plan type or ID.' });
      }


      const deleteFn = type === 'day' ? deleteDailyPlanById : deleteWeeklyPlanById;
      return deleteFn(planId, uid);
    })
    .then(result => {
      if (!result || result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Meal plan not found or not yours.' });
      }
      return res.status(200).json({ success: true, message: 'Meal plan deleted.' });
    })
    .catch(err => {
      console.error('[MealPlans] Delete Single Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete meal plan.' });
    });
};




export const searchMealPlanByDate = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => {
      const { date, type } = req.query;

      if (!date || !type || !['day', 'week'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing parameters. "date" and "type" (day|week) are required.'
        });
      }

      return searchPlansByDateOrRange(uid, date, type);
    })
    .then(plans => {
      res.status(200).json({ success: true, plans });
    })
    .catch(error => {
      console.error('[SearchMealPlan] Error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to search meal plans.'
      });
    });
};
