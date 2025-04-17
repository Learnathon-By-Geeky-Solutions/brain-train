import { AIFactory } from '../../../libraries/services/ai-service/aiFactory.js';

import { uploadToFirebase,decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';
import { logUserImageUpload } from '../db.js';
import { formatRecipes } from '../../search/util/formatter.js';
import { recipesByIngredientsHelper } from '../../search/util/searchHelper.js';
import { fetchSaveFilterRecipes } from '../../search/util/fetchHelper.js';

import { spoonacularRequest } from '../../../libraries/services/spoonacular.js';


export const analyzeImageIngredients = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => {
      return uploadToFirebase(req.file).then(imageUrl => ({ uid, imageUrl }));
    })
    .then(({ uid, imageUrl }) => {
      const base64 = req.file.buffer.toString('base64').replace(/^data:image\/\w+;base64,/, '');
      const aiService = AIFactory.create('clarifai');
      return aiService.analyzeImage(base64).then(ingredients => ({ uid, imageUrl, ingredients }));
    })
    .then(({ uid, imageUrl, ingredients }) => {
      const ingredientNames = ingredients
      .sort((a, b) => b.confidence - a.confidence) // sort by confidence, descending
      .slice(0, 5)                                 // take top 5
      .map(i => i.name); 
      const filters = req.query || {};

      return recipesByIngredientsHelper({
        ingredients: ingredientNames.join(','),
        number: filters.number || 10,
        ...filters
      }).then(recipes => ({
        uid,
        imageUrl,
        ingredients,
        recipes
      }));
    })
    .then(({ uid, imageUrl, ingredients, recipes }) => {
      return logUserImageUpload(uid, imageUrl).then(() => {
        const formatted = formatRecipes(recipes);
        res.status(200).json({
          imageUrl,
          ingredients,
          results: formatted,
          totalResults: formatted.length
        });
      });
    })
    .catch(err => {
      console.error(' analyzeImageIngredients error:', err.message);
      res.status(500).json({ error: 'Image analysis failed' });
    });
};



export const analyzeImageRecipe = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then(({ uid }) => {
      return uploadToFirebase(req.file).then(imageUrl => ({ uid, imageUrl }));
    })
    .then(({ uid, imageUrl }) => {
      return spoonacularRequest('/food/images/analyze', { imageUrl })
        .then(spoonacularData => ({ uid, imageUrl, spoonacularData }));
    })
    .then(({ uid, imageUrl, spoonacularData }) => {
      const recipeIds = (spoonacularData.recipes || []).map(r => r.id);
      if (!recipeIds.length) {
        return res.status(200).json({ imageUrl, spoonacularData, results: [], totalResults: 0 });
      }

      const filters = req.query || {};

      return fetchSaveFilterRecipes(recipeIds, filters).then(enrichedRecipes => {
        const formatted = formatRecipes(enrichedRecipes);

        // Optional DB log
        return logUserImageUpload(uid, imageUrl).then(() => {
          res.status(200).json({
            imageUrl,
            category: spoonacularData.category,
            nutrition: spoonacularData.nutrition,
            results: formatted,
            totalResults: formatted.length,
          });
        });
      });
    })
    .catch(err => {
      console.error(' analyzeImageRecipe Error:', err.message);
      res.status(500).json({ error: 'Image analysis failed' });
    });
};