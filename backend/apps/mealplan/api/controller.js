import { decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';
import { generateMealPlanAndSave } from '../utils/planService.js';



export const planMeal = (req, res) => {
    decodeFirebaseIdToken(req.headers.authorization)
      .then(({ uid }) => generateMealPlanAndSave(uid, req.body))
      .then(plan => res.status(201).json({ plan }))
      .catch(error => {
        console.error(' Meal planning error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
      });
  };