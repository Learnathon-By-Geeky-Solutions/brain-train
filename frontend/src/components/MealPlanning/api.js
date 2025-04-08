const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import sampleMealData, { sampleMeals, samplePlanList } from "./sampleMealData";

function generateMealPlanUrl(startDate, plan) {
    let url = `${API_BASE_URL}/plan?startDate=${startDate}`;
    
    if (plan.exclude) {
        url += `&exclude=${plan.exclude}`;
    }
    
    if (plan.diet.length) {
        url += `&diet=${plan.diet.join(",")}`;
    }
    
    if (plan.timeFrame) {
        url += `&timeFrame=${plan.timeFrame}`;
    }
    
    if (plan.targetCalories) {
        url += `&targetCalories=${plan.targetCalories}`;
    }
    
    return url;
}

function getMealData(startDate,timeFrame) {
    if(timeFrame === 'week')
    return sampleMealData;
    return sampleMeals;
//   const auth = getAuth();
//   let data = {status: "error", msg: ""};
//   const url = `${API_BASE_URL}/plan?startDate=${startDate}`;
  
//   // Return a promise that resolves when auth state is ready
//   return new Promise((resolve) => {
//     // This listener fires once when auth state is first determined
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       unsubscribe(); // Stop listening immediately after first auth state is determined
      
//       if (user) {
//         const idToken = await user.getIdToken();
//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${idToken}`,
//           },
//         });
        
//         if (response.ok) {
//           data = await response.json();
//         } else {
//           data.msg = "Failed to get meal data";
//         }
//       } else {
//         data.msg = "User not logged in";
//       }
      
//       resolve(data);
//     });
//   });
}

async function saveMealPlan(plan,startDate,setReload) {
  const auth = getAuth();
  let data = {status: "error", msg: ""};
  const url = generateMealPlanUrl(startDate, plan);
  setReload(true);
  console.log('plan from saveMealPlan ');
  console.log(plan);
  console.log(url);
  
//   // Return a promise that resolves when auth state is ready
//   return new Promise((resolve) => {
//     // This listener fires once when auth state is first determined
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       unsubscribe(); // Stop listening immediately after first auth state is determined
      
//       if (user) {
//         const idToken = await user.getIdToken();
//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${idToken}`,
//           },
//         });
        
//         if (response.ok) {
//           data = await response.json();
//         } else {
//           data.msg = "Failed to get shopping list";
//         }
//       } else {
//         data.msg = "User not logged in";
//       }
      
//       resolve(data);
//     });
//   });
}

 function getMyPlans() {
    return samplePlanList;
//   const auth = getAuth();
//   let data = {status: "error", msg: ""};
//   const url = `${API_BASE_URL}/plan`;
  
//   // Return a promise that resolves when auth state is ready
//   return new Promise((resolve) => {
//     // This listener fires once when auth state is first determined
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       unsubscribe(); // Stop listening immediately after first auth state is determined
      
//       if (user) {
//         const idToken = await user.getIdToken();
//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${idToken}`,
//           },
//         });
        
//         if (response.ok) {
//           data = await response.json();
//         } else {
//           data.msg = "Failed to get shopping list";
//         }
//       } else {
//         data.msg = "User not logged in";
//       }
      
//       resolve(data);
//     });
//   });
}

async function deletePlan(planId){
    console.log('delete plan with id: ', planId);
    // const auth = getAuth();
    // let data = {status: "error", msg: ""};
    // const url = `${API_BASE_URL}/plan/${planId}`;
    
    // // Return a promise that resolves when auth state is ready
    // return new Promise((resolve) => {
    //     // This listener fires once when auth state is first determined
    //     const unsubscribe = onAuthStateChanged(auth, async (user) => {
    //     unsubscribe(); // Stop listening immediately after first auth state is determined
        
    //     if (user) {
    //         const idToken = await user.getIdToken();
    //         const response = await fetch(url, {
    //         method: "DELETE",
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${idToken}`,
    //         },
    //         });
            
    //         if (response.ok) {
    //         data = await response.json();
    //         } else {
    //         data.msg = "Failed to delete plan";
    //         }
    //     } else {
    //         data.msg = "User not logged in";
    //     }
        
    //     resolve(data);
    //     });
    // });
}

export { getMealData, saveMealPlan, getMyPlans, deletePlan };