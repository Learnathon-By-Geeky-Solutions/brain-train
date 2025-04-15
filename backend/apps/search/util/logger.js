/**
 * Debug utility to print recipe state at key steps.
 * @param {Object[]} existingRecipes
 * @param {Set<string>} existingIdsSet
 * @param {string[]} missingIds
 */
export const logExistingMissingInfo = (existingRecipes, existingIdsSet, missingIds) => {
    console.log("Existing Recipe Count:", existingRecipes.length);
    console.log("Existing Recipe IDs Set:", [...existingIdsSet]);
    console.log("Missing Recipe Count:", missingIds.length);
    console.log("Missing Recipe IDs:", missingIds);
  };