export const generateShoppingList = (recipe, requestedServings) => {
    const originalServings = recipe.servings || 1;
    const scaleFactor = requestedServings / originalServings;
  
    const discreteUnits = [
      "clove", "cloves", "slice", "slices", "piece", "pieces", "servings",
      "egg", "eggs", "can", "cans", "handful", "glass", "dash", "pinch",
      "sprig", "sprigs", "bunch", "packet", "packets", "jar", "bottle"
    ];
  
    const merged = {};
  
    for (const ing of recipe.ingredients) {
      const titleKey = ing.title.trim().toLowerCase(); // case-insensitive title key
      const unit = ing.unit?.toLowerCase().trim() || "";
  
      const isDiscrete = discreteUnits.includes(unit);
      const scaledAmount = ing.amount * scaleFactor;
      const finalAmount = isDiscrete ? Math.ceil(scaledAmount) : parseFloat(scaledAmount.toFixed(2));
  
      if (!merged[titleKey]) {
        merged[titleKey] = {
          title: ing.title,
          unit: ing.unit,
          image: ing.image,
          amount: finalAmount
        };
      } 
    }
  
    return Object.values(merged);
  };
  