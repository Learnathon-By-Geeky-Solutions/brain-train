# Project ERD

The following ERD was made using [Gleek.io diagram maker](https://www.gleek.io/)

## Script

```
Users
	string userId PK
	string firebaseUid UK
	string username UK
	string email UK
	string picture

UserFavourites
	string userId FK
	ArrayOfString recipeIds FK

Recipes
	string recipeId PK
	string sourceId FK
	string source
	string title
	string image
	string summary
	bool vegetarian
	bool vegan
	bool glutenFree
	bool dairyFree
	int preparationMinutes
	int cookingMinutes
	int readyInMinutes
	int aggregateLikes
	int servings
	ArrayOfString cuisines
	ArrayOfString dishTypes
	ArrayOfString diets
	ArrayOfIngredient ingredients

Ingredients
	string ingredientId PK
	string title
	string image
	float amount
	string unit

Instructions
	string instructionId PK
	string recipeId FK
	string name
	ArrayOfString steps

Users {1}--{0..n} UserFavourites
UserFavourites {1..n}--{1} Recipes
Users {1}--{0..n} Recipes
Recipes {1}--{1..n} Instructions
```

## Diagram

<a href="https://app.gleek.io/diagrams/1hurlKdEwlu_A8UrxRwwKg" target="_blank">
  <img src="https://sketchertest.blob.core.windows.net/previewimages/1hurlKdEwlu_A8UrxRwwKg.png" alt="Geeky Chef" title="Geeky Chef" />
</a>