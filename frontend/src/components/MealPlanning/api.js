import makeRequest from "@/services/APIcall";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function generateMealPlanReqBody(startDate, plan) {
    const reqBody = {
        startDate: startDate,
        exclude: plan.exclude,
        diet:`${plan.diet.join(",")}`,
        timeFrame: plan.timeFrame
    };
    if(plan.targetCalories){
      reqBody.targetCalories = plan.targetCalories;
    }
    if(plan.name){
      reqBody.title = plan.name;
    }
    if(plan?.ignoreConflict){
      reqBody.deleteOverlap = true;
    }
    return reqBody;
}

async function getMealData(startDate,timeFrame) {
  const url = `${API_BASE_URL}/plan/search?date=${startDate}&type=${timeFrame}`;
  console.log('url from getMealData');
  console.log(url);
  return makeRequest(url, "GET", null);
}

async function saveMealPlan(plan,startDate) {
  const reqBody = generateMealPlanReqBody(startDate, plan);
  const url = `${API_BASE_URL}/plan/generate`;
  console.log('plan from saveMealPlan ');
  console.log(plan);
  console.log(reqBody);
  return makeRequest(url, "POST", reqBody);
}

async function getMyPlans() {
  const url = `${API_BASE_URL}/plan/view`;
  return makeRequest(url, "GET", null);
}

async function deletePlan(planId,type){
  const url = `${API_BASE_URL}/plan/${planId}?type=${type}`;
  return makeRequest(url, "DELETE", null);
}

export { getMealData, saveMealPlan, getMyPlans, deletePlan };