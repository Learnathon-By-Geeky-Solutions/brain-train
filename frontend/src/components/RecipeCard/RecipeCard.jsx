import { Box, Image, Flex, Text, Button } from '@chakra-ui/react';
import { LuHeart } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
  
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const RecipeCard = ({ recipe }) => {

    const navigate = useNavigate();

    const handleRecipeDetail = async (e) => {
      try {
        const response = await fetch(`${API_BASE_URL}/search/recipes/${recipe.id}`, {
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
    <Flex direction="column" alignItems="center">
    <Image src={recipe.image} alt={recipe.title} h="150px" w="100%" objectFit="cover" />
    <Flex direction="column" p={4} alignItems="center" spacing={2} >
      <Text fontSize="lg" fontWeight="bold" color="black" noOfLines={1} alignSelf="flex-start">
        {recipe.title}
      </Text>
      <Flex alignSelf="flex-start" alignItems="center">
        <LuHeart color="black"/>
        <Text fontSize="sm" color="gray.600">
          {recipe.likes}
        </Text>
      </Flex>
      {/* <Flex direction="column" overflow="hidden" alignItems="center" spacing={2} paddingLeft={4} paddingRight={4} paddingTop={0}>
        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {recipe.summary || 'No description available.'}
        </Text>
      </Flex> */}
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
    </Flex>
  </Box>
)};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
  }).isRequired,
};

export default RecipeCard;