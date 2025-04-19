import { body, validationResult } from "express-validator";

export const validateMealPlanRequest = [
  // Required field: timeFrame (day or week)
  body("timeFrame")
    .optional()
    .isIn(["day", "week"])
    .withMessage('timeFrame must be either "day" or "week"'),

  // Optional field: startDate
  body("startDate")
    .optional({ checkFalsy: true }) // ensures empty or missing values are ignored
    .isISO8601()
    .withMessage("startDate must be a valid date (ISO 8601 format)")
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error("startDate cannot be in the past");
      }
      return true;
    }),

  // Optional numeric field: targetCalories
  body("targetCalories")
    .optional()
    .isNumeric()
    .withMessage("targetCalories must be a number"),

  // Optional string field: exclude (comma-separated values)
  body("exclude")
    .optional()
    .isString()
    .withMessage("exclude must be a comma-separated string"),

  // Final handler: catch and return all validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
