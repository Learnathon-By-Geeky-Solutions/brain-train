import { decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';
import { generateMealPlanAndSave } from '../utils/planService.js';
// import { fetchUserDailyPlans, fetchUserWeeklyPlans } from '../services/mealPlanService.js';



export const planMeal = (req, res) => {
    decodeFirebaseIdToken(req.headers.authorization)
      .then(({ uid }) => generateMealPlanAndSave(uid, req.body))
      .then(plan => res.status(201).json({ plan }))
      .catch(error => {
        console.error(' Meal planning error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
      });
  };


export const viewMealPlans = async (req, res) => {
  try {
    decodeFirebaseIdToken(req.headers.authorization);
    const { firebaseUid } = req.user;
    const { type } = req.query;

    const response = {};

    if (!type || type === 'day') {
      response.dailyPlans = await fetchUserDailyPlans(firebaseUid);
    }

    if (!type || type === 'week') {
      response.weeklyPlans = await fetchUserWeeklyPlans(firebaseUid);
    }

    return res.status(200).json({ success: true, ...response });

  } catch (error) {
    console.error('[MealPlans] View Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch meal plans.' });
  }
};
