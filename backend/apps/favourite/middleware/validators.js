import { body } from "express-validator";
import { handleValidationErrors } from "../../../libraries/util/errorHandler.js";

export const validateAddRecipe = [
  body("recipeId")
    .exists({ checkFalsy: true })
    .withMessage("recipeId is required")
    .bail()
    .isString()
    .withMessage("recipeId must be a string"),
  handleValidationErrors,
];

export const validateRemoveRecipe = [
  body("recipeId")
    .exists({ checkFalsy: true })
    .withMessage("recipeId is required")
    .bail()
    .isString()
    .withMessage("recipeId must be a string"),
  handleValidationErrors,
];
