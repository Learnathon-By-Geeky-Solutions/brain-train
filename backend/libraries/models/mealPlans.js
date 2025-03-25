import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  sourceId: {
    type: String, 
    required: true,
    unique: true
  },
  recipeId: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    default: ""
  },
  imageType: {
    type: String,
    default: ""
  },
  title: {
    type: String,
    default: ""
  },
  readyInMinutes: {
    type: Number,
    default: 0
  },
  servings: {
    type: Number,
    default: 0
  }
});

const mealPlanSchema = new mongoose.Schema({
  meals: [mealSchema],
  nutrients: [
    {
      name: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        default: 0
      }
    }
  ]
});

const dailyMealSchema = new mongoose.Schema({
  firebaseUid: {
    type: String, 
    required: true,
    unique: true
  },
  dailyMealPlans: [
    {
      title: {
        type: String,
        default: "Daily Meal Plan#"
      },
      mealPlan: mealPlanSchema,
      savedAt: {
        type: Date,
        default: Date.now()
      }
    }
  ]
});

const weeklyPlanSchema = new mongoose.Schema({
  firebaseUid: {
    type: String, 
    required: true,
    unique: true
  },
  weeklyMealPlans: [
    {
      title: {
        type: String,
        default: "Weekly Meal Plan#"
      },
      dailyMealPlans: [mealPlanSchema],
      startDate: {
        type: Date,
        required: true,
        default: Date.now()
      },
      endDate: {
        type: Date,
        required: true
      }
    }
  ]
});


const DailyMealPlan = mongoose.model('DailyMealPlan', dailyMealSchema);
const WeeklyMealPlan = mongoose.model('WeeklyMealPlan', weeklyPlanSchema);

export {
  DailyMealPlan,
  WeeklyMealPlan
};
