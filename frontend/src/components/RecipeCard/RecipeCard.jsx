import { Box, Image, Flex, Text, VStack, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

// const fetchRecipeDetails = async () => {
//     const recipeId = 642303; // Example recipe ID
//     const includeNutrition = true; // Query parameter
  
//     try {
//       const response = await fetch(
//         `http://localhost:8000/search/recipes/${recipeId}?includeNutrition=${includeNutrition}`
//       );
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
  
//       const data = await response.json(); // Assuming the API returns JSON
//       console.log(data); // Handle the response data
//     } catch (error) {
//       console.error('Error fetching recipe details:', error);
//     }
//   };
  

const RecipeCard = ({ recipe }) => {

    const navigate = useNavigate();

    const handleRecipeDetail = async (e) => {
      // e.preventDefault();
      try {
        const response = await fetch(`http://localhost:8000/search/recipes/${recipe.id}`, {
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
    <Image src={recipe.image} alt={recipe.title} h="150px" w="100%" objectFit="cover" />
    <Flex direction="column" maxHeight="50%" overflow="hidden" p={4} alignItems="center" spacing={2} >
      <Text fontSize="lg" fontWeight="bold" color="black" noOfLines={1}>
        {recipe.title}
      </Text>
      <Text fontSize="sm" color="gray.600" noOfLines={2}>
        {recipe.summary || 'No description available.'}
      </Text>
      {/* <Button
        size="sm"
        w="100%"
        marginTop="auto"
        onClick={() => {
          handleRecipeDetail();
        }}
      >
        View Recipe
      </Button> */}
    </Flex>
    <Button
        size="sm"
        w="100%"
        onClick={() => {
          handleRecipeDetail();
        }}
      >
        View Recipe
      </Button>
  </Box>
)};

export default RecipeCard;