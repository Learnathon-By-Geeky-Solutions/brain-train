import { Box, Grid, GridItem, Skeleton, Flex, Image, Heading } from '@chakra-ui/react';
import { useLocation, useSearchParams } from 'react-router-dom';
import RecipeCard from '../RecipeCard/RecipeCard';
import PropTypes from 'prop-types';
import { Toaster, toaster } from '../ui/toaster';
import removeFavoriteRecipe from './api';
import { useEffect, useState } from 'react';
import zero_results from '../../assets/zero_results.png';



const RecipeCardContainer = ({recipe_prop,removeCard,containerType="default"}) => {
  const location = useLocation();
  const searchParams = useSearchParams()[0];
  const [cardsPerRow, setCardsPerRow] = useState(containerType === "carousel" ? recipe_prop.length : 6);
  const [maxRows, setMaxRows] = useState(containerType === "carousel" ? 1 : 6);
  
  useEffect(() => {
    function handleResize() {
      // For example, change layout based on window width
      if(containerType === "carousel"){
        setCardsPerRow(recipe_prop.length); 
        console.log('printing cards per row for carousel', recipe_prop.length);
        setMaxRows(1);   
      }
      else if (window.innerWidth < 600) {
        setCardsPerRow(2); // Mobile: 2 card per row
        setMaxRows(15);    // But show more rows
      } else if (window.innerWidth < 960) {
        setCardsPerRow(3); // Tablet: 2 cards per row
        setMaxRows(10);
      } else if (window.innerWidth < 1440) {
        setCardsPerRow(5); // Desktop: 4 cards per row
        setMaxRows(6);
      }
      else {
        setCardsPerRow(6); // Desktop: 4 cards per row
        setMaxRows(6);
      }
    }
    
    // Set initial values
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [recipe_prop.length]);
  

  let type = location.state?.type || searchParams.get("type");

  function toggleVisibility(index) {
    let toasterText = "Could not remove recipe from favourites";
    let toasterType = "error"; 
    removeFavoriteRecipe(recipe_prop[index]).then((result) => {
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
      setTimeout(() => {
        removeCard(index);
      }, 1000);
    });
  }
  
  const maxCards = cardsPerRow * maxRows;

  // Slice the recipes array to show only the maximum number of cards
  const visibleRecipes = recipe_prop?.slice(0, maxCards);

  return (
    <Box
      maxH="100%"
      overflowY="auto"
      maxW="100%"
      p={2}
      m={2}
      bg="none"
      css={{
        "&::-webkit-scrollbar": {
          display: "none", 
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none", 
      }}
    >
      <Grid 
        templateColumns={`repeat(${cardsPerRow == 0 ? 7:cardsPerRow}, 1fr)`}
        gap={4}
      >
        { (!recipe_prop || recipe_prop.length === 0) ?
          Array.from({ length: 7 }).map((_, index) => (
            <GridItem w="fit-content" key={'skeleton'}>
              <Skeleton height="72" width="72" bgColor="gray.950" />
            </GridItem>
          ))
          :
          visibleRecipes.map((recipe, index) => {
            // Only display items that fit within the grid dimensions
            return recipe.id !== -1 ? 
            (<GridItem key={recipe.id} w="fit-content">
              <RecipeCard recipe={recipe} changeVisibility={()=>toggleVisibility(index)} type={type}/>
            </GridItem>)
            :
            (<Flex w="100vw" h="lg" alignItems="center" justifyContent="center" direction="column">
              <Image
                src={zero_results} alt="No results found" 
                w="initial" h="initial"
              />
              <Heading
                size="2xl"
                color="gray.500"
                textAlign="center"
                p="4"
              >
                No Recipes Found
              </Heading>
            </Flex>);
          })
        }
      </Grid>
      <Toaster />
    </Box>
  );
};
RecipeCardContainer.propTypes = {
  recipe_prop: PropTypes.array,
  removeCard: PropTypes.func,
  containerType: PropTypes.string,
};

export default RecipeCardContainer;
