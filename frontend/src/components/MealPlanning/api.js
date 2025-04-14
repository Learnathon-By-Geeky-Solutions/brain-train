const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

import { getAuth, onAuthStateChanged } from "firebase/auth";

async function makeRequest(url, method, body) {
  const auth = getAuth();
  let data = { status: "error", msg: "" };
  // Return a promise that resolves when auth state is ready
  return new Promise((resolve) => {
    // This listener fires once when auth state is first determined
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Stop listening immediately after first auth state is determined
      if (user) {
        const idToken = await user.getIdToken();
        const req = {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
        if(body){
          req.body = JSON.stringify(body);
        }
        const response = await fetch(url, req);
        if (response.ok) {
          data = await response.json();
          console.log("res ok from makeRequest");
          console.log(data);
        }
        else if(response.status === 409){
          data.msg = "overlap";
          data.res = await response.json();
          console.log("overlap from makeRequest");
          console.log(data);
        }
        else {
          console.log("res not ok from makeRequest");
          data.msg = "Failed to make request";
        }
      } else {
        data.msg = "User not logged in";
      }
      resolve(data);
    });
  });
}

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