import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useLocation, useSearchParams } from "react-router-dom";
import RecipeCard from "../RecipeCard/RecipeCard";
import PropTypes from "prop-types";
import { Toaster, toaster } from "../ui/toaster";
import removeFavoriteRecipe from "./api";

const RecipeCardContainer = ({ recipe_prop, perRow, numRows, removeCard }) => {
  const location = useLocation();
  const searchParams = useSearchParams()[0];

  if (!recipe_prop || recipe_prop.length === 0) {
    return <div>No recipes found</div>;
  }

  let type = location.state?.type || searchParams.get("type");

  function toggleVisibility(index) {
    let toasterText = "Could not remove recipe from favourites";
    let toasterType = "error";
    removeFavoriteRecipe(recipe_prop[index]).then((result) => {
      if (result.status === "success") {
        toasterText = "Recipe removed from favourites";
        toasterType = "success";
      }
      toaster.create({
        title: toasterText,
        type: toasterType,
      });
      setTimeout(() => {
        removeCard(index);
      }, 1000);
    });
  }
  // Maximum number of cards per row and rows to display
  const cardsPerRow = perRow || 4;
  const maxRows = numRows || 5;
  const maxCards = cardsPerRow * maxRows;

  // Slice the recipes array to show only the maximum number of cards
  const visibleRecipes = recipe_prop.slice(0, maxCards);

  return (
    <Box
      maxH="100%"
      overflowY="auto"
      maxW="100%"
      p={2}
      px={4}
      bg="none"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      <Grid templateColumns={`repeat(${cardsPerRow}, 1fr)`} gap={4}>
        {visibleRecipes.map((recipe, index) => {
          // Only display items that fit within the grid dimensions
          return (
            <GridItem key={recipe.id}>
              <RecipeCard
                recipe={recipe}
                changeVisibility={() => toggleVisibility(index)}
                type={type}
              />
            </GridItem>
          );
        })}
      </Grid>
      <Toaster />
    </Box>
  );
};
RecipeCardContainer.propTypes = {
  recipe_prop: PropTypes.array,
  perRow: PropTypes.number,
  numRows: PropTypes.number,
  removeCard: PropTypes.func,
};

export default RecipeCardContainer;
