import express from "express";
import {
  searchRecipes,
  searchRecipesByIngredients,
  getRecipesByCuisine,
  getRecipeInformation,
  getRecipeSummary,
  getSimilarRecipes,
  getShoppingList,
  autoCompleteIngredients,
  autoCompleteRecipes,
  getSearchesFromHistory,
} from "./controller.js";

const router = express.Router();

/**
 * @swagger
 * /search/recipes:
 *   get:
 *     summary: Search for recipes by title
 *     description: Searches for recipes based on the title, ingredients, cuisine, and other optional filters.
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: The search query term (e.g., recipe name or ingredients).
 *         schema:
 *           type: string
 *       - in: query
 *         name: fields
 *         required: false
 *         description: A comma-separated list of fields to include in the response (e.g., `title,image,summary`).
 *         schema:
 *           type: string
 *       - in: query
 *         name: cuisine
 *         required: false
 *         description: The cuisine type for filtering the recipes (e.g., `Asian`).
 *         schema:
 *           type: string
 *       - in: query
 *         name: glutenFree
 *         required: false
 *         description: Flag to filter recipes that are gluten-free.
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: vegetarian
 *         required: false
 *         description: Flag to filter recipes that are vegetarian.
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: number
 *         required: false
 *         description: The number of results to return.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: likes
 *         required: false
 *         description: Flag to filter recipes that have a specific number of likes.
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully found and returned recipes matching the query and filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       image:
 *                         type: string
 *                       summary:
 *                         type: string
 *                       likes:
 *                         type: integer
 *       500:
 *         description: Internal server error due to authentication or server issues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/recipes", searchRecipes);

/**
 * @swagger
 * /search/recipes/ingredients:
 *   get:
 *     summary: Search for recipes by ingredients
 *     description: Searches for recipes based on the provided ingredients, with optional filters for cuisine, gluten-free, and other fields.
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: ingredients
 *         required: true
 *         description: A comma-separated list of ingredients to filter recipes.
 *         schema:
 *           type: string
 *       - in: query
 *         name: fields
 *         required: false
 *         description: A comma-separated list of fields to include in the response (e.g., `title,image,summary`).
 *         schema:
 *           type: string
 *       - in: query
 *         name: cuisine
 *         required: false
 *         description: The cuisine type for filtering the recipes (e.g., `Asian`).
 *         schema:
 *           type: string
 *       - in: query
 *         name: glutenFree
 *         required: false
 *         description: Flag to filter recipes that are gluten-free.
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: vegetarian
 *         required: false
 *         description: Flag to filter recipes that are vegetarian.
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: number
 *         required: false
 *         description: The number of results to return.
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully found and returned recipes matching the ingredients and filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       image:
 *                         type: string
 *                       summary:
 *                         type: string
 *                       likes:
 *                         type: integer
 *       500:
 *         description: Internal server error due to missing ingredients or authentication issues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/recipes/ingredients", searchRecipesByIngredients);

/**
 * @swagger
 * /search/recipes/cuisines:
 *   get:
 *     summary: Search recipes by cuisine type
 *     description: Retrieves a list of recipes based on the specified cuisine type. If no cuisine is provided, a `400` error is returned.
 *     tags:
 *       - Search
 *     parameters:
 *       - in: query
 *         name: cuisine
 *         required: true
 *         description: The type of cuisine to search for (e.g., Italian, Asian, etc.).
 *         schema:
 *           type: string
 *       - in: query
 *         name: number
 *         required: false
 *         description: The number of recipes to retrieve (optional).
 *         schema:
 *           type: integer
 *           default: 10
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       image:
 *                         type: string
 *                       likes:
 *                         type: integer
 *                       summary:
 *                         type: string
 *       400:
 *         description: Missing required `cuisine` parameter or invalid query.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Internal server error (e.g., unauthenticated request)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/recipes/cuisines", getRecipesByCuisine);

/**
 * @swagger
 * /search/recipes/{id}:
 *   get:
 *     summary: Retrieve a recipe by its ID
 *     description: Retrieves detailed information for a recipe based on its unique ID. If the ID is invalid, a `400` error is returned. If the recipe does not exist, a `404` error is returned.
 *     tags:
 *       - Search
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the recipe.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the recipe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sourceId:
 *                   type: string
 *                 isUploaded:
 *                   type: boolean
 *                 title:
 *                   type: string
 *                 image:
 *                   type: string
 *                 summary:
 *                   type: string
 *                 vegetarian:
 *                   type: boolean
 *                 vegan:
 *                   type: boolean
 *                 glutenFree:
 *                   type: boolean
 *                 dairyFree:
 *                   type: boolean
 *                 readyInMinutes:
 *                   type: integer
 *                 likes:
 *                   type: integer
 *                 servings:
 *                   type: integer
 *                 cuisines:
 *                   type: array
 *                   items:
 *                     type: string
 *                 dishTypes:
 *                   type: array
 *                   items:
 *                     type: string
 *                 diets:
 *                   type: array
 *                   items:
 *                     type: string
 *                 instructions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 ingredients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       image:
 *                         type: string
 *                       amount:
 *                         type: string
 *                       unit:
 *                         type: string
 *                 nutrition:
 *                   type: object
 *                   properties:
 *                     nutrients:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           amount:
 *                             type: string
 *                           unit:
 *                             type: string
 *                           percentOfDailyNeeds:
 *                             type: string
 *                     properties:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           amount:
 *                             type: string
 *                           unit:
 *                             type: string
 *       400:
 *         description: Invalid recipe ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid recipe."
 *       404:
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Recipe not found."
 *       500:
 *         description: Internal server error (e.g., unauthenticated request)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/recipes/:id", getRecipeInformation);

/**
 * @swagger
 * /search/recipes/{id}/summary:
 *   get:
 *     summary: Get the summary of a specific recipe.
 *     description: Retrieve only the summary information of a specific recipe.
 *     tags:
 *       - Search
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique identifier of the recipe.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The summary of the recipe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *       400:
 *         description: Bad Request if the recipe ID is invalid.
 *       404:
 *         description: Not Found if the recipe with the given ID doesn't exist.
 *       500:
 *         description: Internal server error.
 */
router.get("/recipes/:id/summary", getRecipeSummary);

/**
 * @swagger
 * /search/recipes/{id}/similar:
 *   get:
 *     summary: Get similar recipes to a specific recipe.
 *     description: Retrieve a list of recipes similar to the one specified by the given ID.
 *     tags:
 *       - Search
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique identifier of the recipe.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of similar recipes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       image:
 *                         type: string
 *                       summary:
 *                         type: string
 *                       likes:
 *                         type: integer
 *       400:
 *         description: Bad Request if the recipe ID is invalid.
 *       404:
 *         description: Not Found if the recipe with the given ID doesn't exist.
 *       500:
 *         description: Internal server error.
 */
router.get("/recipes/:id/similar", getSimilarRecipes);

/**
 * @swagger
 * /search/recipes/{recipeId}/shoppingList:
 *   get:
 *     summary: Get shopping list for a specific recipe
 *     description: Fetches the shopping list of ingredients required for a recipe, adjusted to the specified serving size.
 *     tags:
 *       - Shopping List
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         description: The ID of the recipe.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: requestedServing
 *         required: false
 *         description: The number of servings for which the shopping list should be calculated.
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful retrieval of shopping list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipeId:
 *                   type: integer
 *                 servings:
 *                   type: integer
 *                 shoppingList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       unit:
 *                         type: string
 *                       image:
 *                         type: string
 *                       amount:
 *                         type: number
 *       400:
 *         description: Bad request (e.g., missing or invalid query parameter)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error (e.g., invalid recipe ID or other issues)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/recipes/:id/shoppingList", getShoppingList);

// Autocomplete endpoints
/**
 * @swagger
 * /search/title/autocomplete:
 *   get:
 *     summary: Autocomplete recipe title search based on a query.
 *     description: Fetch recipe title suggestions based on the query string, triggering both the database and API.
 *     tags:
 *       - Autocomplete
 *     parameters:
 *       - name: query
 *         in: query
 *         description: The search query for autocomplete.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of recipe title suggestions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *       400:
 *         description: Bad Request if the query parameter is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.get("/title/autocomplete", autoCompleteRecipes);

/**
 * @swagger
 * /search/ingredients/autocomplete:
 *   get:
 *     summary: Autocomplete ingredient search based on a query.
 *     description: Fetch ingredient suggestions based on the query string, triggering the API for results.
 *     tags:
 *       - Autocomplete
 *     parameters:
 *       - name: query
 *         in: query
 *         description: The search query for autocomplete.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of ingredient suggestions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *       400:
 *         description: Bad Request if the query parameter is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.get("/ingredients/autocomplete", autoCompleteIngredients);

/**
 * @swagger
 * /search/history/{n}:
 *   get:
 *     summary: Get search history of the user
 *     description: Retrieves a user's search history, limited to `n` most recent unique recipes. If no search history exists, an empty list is returned.
 *     tags:
 *       - Search
 *     parameters:
 *       - in: path
 *         name: n
 *         required: true
 *         description: The number of most recent unique recipes to retrieve from the user's search history.
 *         schema:
 *           type: integer
 *           minimum: 1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the search history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       image:
 *                         type: string
 *                       likes:
 *                         type: integer
 *                       summary:
 *                         type: string
 *       400:
 *         description: Invalid query (e.g., negative or zero `n` value)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid history query."
 *       500:
 *         description: Internal server error (e.g., unauthenticated request)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/history/:n", getSearchesFromHistory);

export default router;
