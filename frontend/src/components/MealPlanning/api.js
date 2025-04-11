const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

import { getAuth, onAuthStateChanged } from "firebase/auth";

function generateMealPlanReqBody(startDate, plan) {
    const reqBody = {
        startDate: startDate,
        targetCalories: plan.targetCalories,
        exclude: plan.exclude,
        diet:`${plan.diet.join(",")}`,
        timeFrame: plan.timeFrame
    };
    return reqBody;
}

async function getMealData(startDate,timeFrame,id) {
  const auth = getAuth();
  let data = {status: "error", msg: ""};
  let url = `${API_BASE_URL}/plan/view/${id}`;
  if(timeFrame === 'week'){
    url += `?type=week`;
  }
  else{
    url += `?type=day`;
  }
  
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

async function saveMealPlan(plan,startDate,setReload) {
  const auth = getAuth();
  let data = {status: "error", msg: ""};
  const reqBody = generateMealPlanReqBody(startDate, plan);
  setReload(true);
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
        } else {
          data.msg = "Failed to get meal plan";
          console.log("res not ok from saveMealPlan");
          console.log(data);
        }
      } else {
        data.msg = "User not logged in";
      }
      
      resolve(data);
    });
  });
}

async function getMyPlans() {
  const auth = getAuth();
  let data = {status: "error", msg: "", plans:[]};
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
          data.plans.push(...planList.dailyPlans);
          console.log("day plans: ", data.plans);
          data.plans.push(...planList.weeklyPlans);
          console.log("week plans: ", data.plans);
         
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

async function deletePlan(planId){
    const auth = getAuth();
    let data = {status: "error", msg: ""};
    const url = `${API_BASE_URL}/plan/${planId}?type=day`;
    
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