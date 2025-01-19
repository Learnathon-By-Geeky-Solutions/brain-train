import { Box, Image, Flex, Text, VStack, Button } from '@chakra-ui/react';
import { HiHeart } from 'react-icons/hi';
import { LuHeart } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
  

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

export default RecipeCard;