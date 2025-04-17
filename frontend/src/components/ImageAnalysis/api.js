// Mock API function to simulate image upload with progress
const uploadImageWithProgress = (file, onProgress) => {
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
                foodName: "Grilled Salmon with Vegetables",
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

export {uploadImageWithProgress};