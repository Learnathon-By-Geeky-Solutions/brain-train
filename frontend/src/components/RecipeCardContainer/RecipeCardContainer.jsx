import { Box, Flex } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import RecipeCard from '../RecipeCard/RecipeCard';
import PropTypes, { func } from 'prop-types';
import { useState } from 'react';
import { Toaster, toaster } from '../ui/toaster';
import removeFavoriteRecipe from './api';


const RecipeCardContainer = ({recipe_prop,perRow,numRows}) => {
  const location = useLocation();
  let recipes = location.state?.recipes;
  let type = location.state?.type;

  if(recipe_prop && !recipes){
    recipes = recipe_prop;
  }

  const [ isVisibile, setIsVisible ] = useState(Array(recipes.length).fill(true));

  function toggleVisibility(index) {
    const newVisibility = [...isVisibile];
    newVisibility[index] = !newVisibility[index];
    setIsVisible(newVisibility);
    let toasterText = "Could not remove recipe from favourites";
    let toasterType = "error"; 
    removeFavoriteRecipe(recipes[index]).then((result) => {
      if(result.status === 'success'){
        toasterText = "Recipe removed from favourites";
        toasterType = "success";
      }
      toaster.create(
        {
          title: toasterText,
          type: toasterType,
        }
      );
    });
  }

  if (!recipes || recipes.length === 0) {
    return (<div>No recipes found or still loading...</div>);
  }
  // Maximum number of cards per row and rows to display
  const cardsPerRow = perRow || 5;
  const maxRows = numRows || 5;
  const maxCards = cardsPerRow * maxRows;

  // Slice the recipes array to show only the maximum number of cards
  const visibleRecipes = recipes.slice(0, maxCards);

  return (
    <Box
      maxH="100%"
      overflowY="auto"
      maxW="100%"
      p={2}
      bg="none"
      css={{
        "&::-webkit-scrollbar": {
          display: "none", 
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none", 
      }}
    >
      <Flex flexWrap={ numRows === 1 ? "nowrap" : "wrap" }
      justify={ numRows === 1 ? "start" : "center" }
      width={ numRows === 1 ? "max-content" : "auto" }
      gap={4}>
        {visibleRecipes.map((recipe, index) => (
            isVisibile[index] && <RecipeCard key={recipe.id} recipe={recipe} changeVisibility={()=>toggleVisibility(index)} type={type}/>
        ))}
      </Flex>
      <Toaster />
    </Box>
  );
};
RecipeCardContainer.propTypes = {
  recipe_prop: PropTypes.array,
  perRow: PropTypes.number,
  numRows: PropTypes.number,
};

export default RecipeCardContainer;
