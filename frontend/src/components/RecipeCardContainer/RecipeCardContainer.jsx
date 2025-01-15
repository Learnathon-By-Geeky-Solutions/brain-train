import { Box, Image, Flex, Text, VStack, Button, Span } from '@chakra-ui/react';

const RecipeCard = ({ recipe }) => (
  <Box
    bg="white"
    borderRadius="md"
    boxShadow="lg"
    overflow="hidden"
    maxW="220px"
    _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s ease-in-out' }}
    cursor="pointer"
  >
    <Image src={recipe.image} alt={recipe.name} h="150px" w="100%" objectFit="cover" />
    <VStack p={4} align="start" spacing={2}>
      <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
        {recipe.name}
      </Text>
      <Text fontSize="sm" color="gray.600" noOfLines={2}>
        {recipe.description || 'No description available.'}
      </Text>
      <Button
        size="sm"
        colorScheme="teal"
        w="100%"
        onClick={() => alert(`You clicked on ${recipe.name}`)}
      >
        View Recipe
      </Button>
    </VStack>
  </Box>
);

const RecipeCardContainer = ({ recipes }) => {
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
            <RecipeCard recipe={recipe} />
        ))}
      </Flex>
    </Box>
  );
};

export default RecipeCardContainer;
