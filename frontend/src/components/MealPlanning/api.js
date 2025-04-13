const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

import { getAuth, onAuthStateChanged } from "firebase/auth";

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
    return reqBody;
}

async function getMealData(startDate,timeFrame) {
  const auth = getAuth();
  let data = {status: "error", msg: ""};
  const url = `${API_BASE_URL}/plan/search?date=${startDate}&type=${timeFrame}`;
  console.log('url from getMealData');
  console.log(url);
  
  // Return a promise that resolves when auth state is ready
  return new Promise((resolve) => {
    // This listener fires once when auth state is first determined
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Stop listening immediately after first auth state is determined
      
      if (user) {
        const idToken = await user.getIdToken();
        const response = await fetch(url, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        });
        
        if (response.ok) {
          data = await response.json();
          console.log("res ok from getMealData");
          console.log(data);
        } else {
          console.log("res not ok from getMealData");
          data.msg = "Failed to get meal data";
        }
      } else {
        data.msg = "User not logged in";
      }
      
      resolve(data);
    });
  });
}

async function saveMealPlan(plan,startDate) {
  const auth = getAuth();
  let data = {status: "error", msg: "", res:null};
  const reqBody = generateMealPlanReqBody(startDate, plan);
  console.log('plan from saveMealPlan ');
  console.log(plan);
  console.log(reqBody);
  
  // Return a promise that resolves when auth state is ready
  return new Promise((resolve) => {
    // This listener fires once when auth state is first determined
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Stop listening immediately after first auth state is determined
      
      if (user) {
        const idToken = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/plan/generate`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(reqBody)
        });
        
        if (response.ok) {
          data = await response.json();
            console.log("res ok from saveMealPlan");
            console.log(data);
        } 
        else if(response.status === 409){
          data.msg = "overlap";
          data.res = await response.json();
          console.log("overlap from saveMealPlan");
          console.log(data);
        }
        else{
          const res = await response.json();
          data.msg = res.errors[0].msg;
          console.log("res not ok from saveMealPlan");
          console.log(data);
        }
      } 
      else {
        data.msg = "User not logged in";
      }
      
      resolve(data);
    });
  });
}

async function getMyPlans() {
  const auth = getAuth();
  let data = {status: "error", msg: "", plans:{daily:[], weekly:[]} };
  const url = `${API_BASE_URL}/plan/view`;
  
  // Return a promise that resolves when auth state is ready
  return new Promise((resolve) => {
    // This listener fires once when auth state is first determined
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Stop listening immediately after first auth state is determined
      
      if (user) {
        const idToken = await user.getIdToken();
        const response = await fetch(url, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        });
        
        if (response.ok) {
          data.status = "success"
          const planList = await response.json();
          data.plans.daily = planList.dailyPlans;
          console.log("day plans: ", data.plans.daily);
          data.plans.weekly = planList.weeklyPlans;
          console.log("week plans: ", data.plans.weekly);
         
        } else {
          data.msg = "Failed to get my plans";
        }
      } else {
        data.msg = "User not logged in";
      }
      
      resolve(data);
    });
  });
}

async function deletePlan(planId,type){
    const auth = getAuth();
    let data = {status: "error", msg: ""};
    const url = `${API_BASE_URL}/plan/${planId}?type=${type}`;
    
    // Return a promise that resolves when auth state is ready
    return new Promise((resolve) => {
        // This listener fires once when auth state is first determined
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe(); // Stop listening immediately after first auth state is determined
        
        if (user) {
            const idToken = await user.getIdToken();
            const response = await fetch(url, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`,
            },
            });
            
            if (response.ok) {
            data = await response.json();
            } else {
            data.msg = "Failed to delete plan";
            }
        } else {
            data.msg = "User not logged in";
        }
        
        resolve(data);
        });
    });
}

export { getMealData, saveMealPlan, getMyPlans, deletePlan };