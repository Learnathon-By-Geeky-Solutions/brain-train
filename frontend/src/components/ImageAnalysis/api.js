import fetchData from "@/pages/Dashboard/api";

// Mock API function to simulate image upload with progress
const uploadImageWithProgressIngredients = (file, onProgress) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        onProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          
          // Mock response data for the image analysis
          setTimeout(() => {
            resolve({
              success: true,
              imageData: {
                type: "ingredient",
                foodName: "Ingredient Extraction",
                ingredients: [
                  { name: "Salmon", confidence: 0.98 },
                  { name: "Broccoli", confidence: 0.95 },
                  { name: "Bell Peppers", confidence: 0.92 },
                  { name: "Olive Oil", confidence: 0.85 },
                  { name: "Lemon", confidence: 0.82 }
                ],
                nutritionFacts: {
                  calories: 320,
                  protein: 34,
                  carbs: 12,
                  fat: 16,
                  fiber: 4
                },
                healthScore: 87,
                preparationMethod: "Grilled",
                cuisineOrigin: "Mediterranean"
              }
            });
          }, 500);
        }
      }, 100);
    });
};

const uploadImageWithProgressNutrition = (file, onProgress) => {
  return new Promise((resolve) => {
    let progress = 0;
    let res;
    const data = {type: "title", data: "pizza" }
    fetchData(data).then((response) => {
      res = response;
      console.log('printing recipes from analysis api');
      console.log(res);
    });
    const interval = setInterval(() => {
      progress += 5;
      onProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
        // Mock response data for the image analysis
        setTimeout(() => {
          resolve({
            success: true,
            imageData: {
              type: "nutrition",
              foodName: "Nutrition Analysis",
              ingredients: [
                { name: "Salmon", confidence: 0.98 },
                { name: "Broccoli", confidence: 0.95 },
                { name: "Bell Peppers", confidence: 0.92 },
                { name: "Olive Oil", confidence: 0.85 },
                { name: "Lemon", confidence: 0.82 }
              ],
              nutritionFacts: {
                calories: 320,
                protein: 34,
                carbs: 12,
                fat: 16,
                fiber: 4
              },
              healthScore: 87,
              preparationMethod: "Grilled",
              cuisineOrigin: "Mediterranean",
              recipes: res
            }
          });
        }, 500);
      }
    }, 100);
  });
};

export {uploadImageWithProgressIngredients, uploadImageWithProgressNutrition};