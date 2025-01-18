import { Box, Image, Flex, Text, VStack, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {

    const navigate = useNavigate();

    const handleRecipeDetail = async (e) => {
      // e.preventDefault();
      try {
        // const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;
        const response = await fetch('http://localhost:3000/api/recipe', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${2+2}`,
            },
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Fetched recipeDetail:', data);
            navigate('/dashboard/recipe', { state: { recipe: data } });
        } else {
            console.error('Failed to fetch recipes. Error code:', response.status);
        }
      } catch (err) {
          console.error("Error from central search frame", err.message);
      }
  };

  return (
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
        onClick={() => {
          handleRecipeDetail();
        }}
      >
        View Recipe
      </Button>
    </VStack>
  </Box>
)};

export default RecipeCard;