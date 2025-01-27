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
	string recipeId FK
	string source

FavouriteRecipes
	string recipeId PK
	int spoonacularId UK
	string title
	string image
	int likes

UserUploadedRecipes
	string recipeId PK
	string userId FK
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
	string instructions
	ArrayOfStrings cuisines
	ArrayOfStrings dishTypes
	ArrayOfStrings diets

RecipeIngredients
	string recipeId FK
	string ingredientId FK

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
	ArrayOfStrings steps

Users {1}--{0..n} UserFavourites
UserFavourites {1..n}--{1} FavouriteRecipes
Users {1}--{0..n} UserUploadedRecipes
UserFavourites {1..n}--{01} UserUploadedRecipes
UserUploadedRecipes {1}--{1..n} RecipeIngredients
RecipeIngredients {1}--{1} Ingredients
UserUploadedRecipes {1}--{1..n} Instructions
```

## Diagram

<a href="https://app.gleek.io/diagrams/1hurlKdEwlu_A8UrxRwwKg" target="_blank">
    <img src="https://sketchertest.blob.core.windows.net/previewimages/1hurlKdEwlu_A8UrxRwwKg.png" alt="Geeky Chef" title="Geeky Chef" />
</a>