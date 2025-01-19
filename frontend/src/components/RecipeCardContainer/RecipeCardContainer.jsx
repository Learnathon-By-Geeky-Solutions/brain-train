import { Box, Image, Flex, Text, VStack, Button, Span, Heading } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import RecipeCard from '../RecipeCard/RecipeCard';

const RecipeCardContainer = () => {
  const location = useLocation();
  const recipes = location.state?.recipes;

  if (!recipes || recipes.length === 0) {
    return (<div>No recipes found or still loading...</div>);
  }
  // Maximum number of cards per row and rows to display
  const cardsPerRow = 5;
  const maxRows = 4; // Adjust based on your design preference
  const maxCards = cardsPerRow * maxRows;

  // Slice the recipes array to show only the maximum number of cards
  const visibleRecipes = recipes.slice(0, maxCards);

  return (
    <Box
      maxH="600px"
      overflowY="auto"
      p={4}
      border="1px solid"
      borderColor="gray.300"
      borderRadius="lg"
      bg="gray.50"
    >
      <Flex flexWrap="wrap" justify="center" gap={4}>
        {visibleRecipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
        ))}
      </Flex>
    </Box>
  );
};

export default RecipeCardContainer;
