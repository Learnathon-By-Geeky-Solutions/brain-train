import { Box, Image, Flex, Text, Button, Card } from '@chakra-ui/react';
import { LuHeart } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import recipe_default from '../../assets/recipe_default.jpg';
  
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const RecipeCard = ({ recipe, changeVisibility, type }) => {

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
            navigate('/dashboard/recipe', { state: { recipe: data } });
        } else {
            console.error('Failed to fetch recipes. Error code:', response.status);
        }
      } catch (err) {
          console.error("Error from central search frame", err.message);
      }
  };

  return (
  // <Box
  //   bg="white"
  //   borderRadius="md"
  //   boxShadow="lg"
  //   overflow="hidden"
  //   maxW="220px"
  //   _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s ease-in-out' }}
  //   cursor="pointer"
  // >
  //   <Flex direction="column" alignItems="center">
  //   <Image src={recipe.image} alt={recipe.title} h="150px" w="100%" objectFit="cover" />
  //   <Flex direction="column" p={4} alignItems="center" spacing={2} >
  //     <Text fontSize="lg" fontWeight="bold" color="black" noOfLines={1} alignSelf="flex-start">
  //       {recipe.title}
  //     </Text>
  //     <Flex alignSelf="flex-start" alignItems="center">
  //       <LuHeart color="black"/>
  //       <Text fontSize="sm" color="gray.600">
  //         {recipe.likes}
  //       </Text>
  //     </Flex>
  //     {/* <Flex direction="column" overflow="hidden" alignItems="center" spacing={2} paddingLeft={4} paddingRight={4} paddingTop={0}>
  //       <Text fontSize="sm" color="gray.600" noOfLines={2}>
  //         {recipe.summary || 'No description available.'}
  //       </Text>
  //     </Flex> */}
  //   </Flex>
  //   <Flex direction="row">
  //     <Button
  //         size="sm"
  //         variant="outline"
  //         onClick={() => {
  //           handleRecipeDetail();
  //         }}
  //       >
  //         View Recipe
  //     </Button>
  //     { type === "favourites" && 
  //       (
  //         <Button
  //           size="sm"
  //           variant="outline"
  //           onClick={() => {
  //             changeVisibility();
  //           }}
  //         >
  //           Remove
  //         </Button>
  //       )
  //     }
  //   </Flex>
  //   </Flex>
  // </Box>
  <Card.Root maxW="xs" overflow="hidden"
  _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s ease-in-out' }}
  >
      <Image
        src={recipe.image || recipe_default}
        alt={recipe.title}
        onError={(e) => {
          e.target.src = recipe_default;
        }}
      />
      <Card.Body gap="2">
        <Card.Title>{recipe.title}</Card.Title>
        <Flex alignSelf="flex-start" alignItems="center">
        <LuHeart/>
          <Text fontSize="sm" ml={1}>
            {recipe.likes}
          </Text>
        </Flex>
        <Card.Description>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Card.Description>
      </Card.Body>
      <Card.Footer gap="2">
        <Button 
        variant="solid"
        onClick={() => {
          handleRecipeDetail();
        }}
        >
          View
        </Button>
        { type === "favourites" && 
        (
          <Button
            variant="ghost"
            onClick={() => {
              changeVisibility();
            }}
          >
            Remove
          </Button>
        )
      }
      {/* <Button variant="ghost">Add to cart</Button> */}
      </Card.Footer>
    </Card.Root>
)};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    recipeId: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
  }).isRequired,
};

export default RecipeCard;