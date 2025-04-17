import { fetchSaveFilterRecipes }  from '../../search/util/fetchHelper.js';
export const mapSpoonacularMeal = (meal, recipe = null) => ({
    sourceId: String(meal.id),
    recipeId: recipe?._id?.toString() || '',
    title: recipe?.title || meal.title || '',
    image: recipe?.image || meal.image || '',
    imageType: recipe?.imageType || meal.imageType || '',
    readyInMinutes: meal.readyInMinutes || recipe?.readyInMinutes || 0,
    servings: meal.servings || recipe?.servings || 0
  });
  
  
 
export const enrichMealsWithRecipeIds = (meals) => {
    const sourceIds = meals.map(m => String(m.id));
    return fetchSaveFilterRecipes(sourceIds) // Using with no filter, it will fetch and save details if not in DB and return the details of the recipes
        .then(enrichedRecipes => {
            console.log("Enriched Recipes Returned:", enrichedRecipes.map(r => ({
                sourceId: r.sourceId,
                _id: r._id,
                id: r.id
            })));

            const recipeMap = new Map(enrichedRecipes.map(recipe => [String(recipe.sourceId), recipe]));

            return meals.map(meal => {
                const matchedRecipe = recipeMap.get(String(meal.id));
                return mapSpoonacularMeal(meal, matchedRecipe);
            });
        });
};