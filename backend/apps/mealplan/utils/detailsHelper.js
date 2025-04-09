import { fetchSaveFilterRecipes }  from '../../search/helper.js';
export const mapSpoonacularMeal = (meal, recipe = null) => ({
    sourceId: String(meal.id),
    recipeId: recipe?._id?.toString() || '',
    title: recipe?.title || meal.title || '',
    image: recipe?.image || meal.image || '',
    imageType: recipe?.imageType || meal.imageType || '',
    readyInMinutes: meal.readyInMinutes || recipe?.readyInMinutes || 0,
    servings: meal.servings || recipe?.servings || 0
  });
  
  
 
  export const enrichMealsWithRecipeIds = async (meals) => {
    const sourceIds = meals.map(m => String(m.id));
    const enrichedRecipes = await fetchSaveFilterRecipes(sourceIds); //// using with no filter,it will fetch and save details if not in db and return the details of the recipes
  
    console.log("Enriched Recipes Returned:", enrichedRecipes.map(r => ({
        sourceId: r.sourceId,
        _id: r._id,
        id: r.id
      })));
      
    const recipeMap = new Map(enrichedRecipes.map(recipe => [String(recipe.sourceId), recipe]));
  

    return meals.map(meal => {
        const matchedRecipe = recipeMap.get(String(meal.id));
        if (!matchedRecipe) {
          console.warn(`⚠️ No recipe match for meal ID: ${meal.id}`);
        } else {
          console.log(`✅ Matched ${meal.title} → RecipeId: ${matchedRecipe._id}`);
        }
      
        return mapSpoonacularMeal(meal, matchedRecipe);
      });
      
  };