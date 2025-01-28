import { body } from 'express-validator';
import { handleValidationErrors } from '../../../libraries/errorHandler.js';

export const validateAddRecipe = [
  body('source')
    .isString()
    .isIn(['spoonacular', 'upload'])
    .withMessage('source must be either "spoonacular" or "upload"'),
  
  body('recipeId')
    .if(body('source').equals('upload'))
    .isString()
    .notEmpty()
    .withMessage('recipeId is required'),
  body('spoonacularId')
    .if(body('source').equals('spoonacular'))
    .isNumeric()
    .notEmpty()  
    .withMessage('spoonacularId is required for spoonacular recipes'),

  body('title')
    .if(body('source').equals('spoonacular'))
    .isString()
    .notEmpty()
    .withMessage('title is required'),
  body('image')
    .if(body('source').equals('spoonacular'))
    .isString()
    .isURL()
    .withMessage('The image must be a valid URL for spoonacular recipes.'),
  
  body('likes')
    .optional()
    .isNumeric()
    .withMessage('The likes field must be a number.'),

  handleValidationErrors
];

export const validateRemoveRecipe = [
  body('recipeId')
    .isString()
    .notEmpty()
    .withMessage('recipeId is required'),

  handleValidationErrors
];