import { Image, Flex, Text, Button, Card } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import recipe_default from '../../assets/recipe_default.jpg';
import { FaHeart } from 'react-icons/fa';
import { getAuth } from "firebase/auth";
  
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const RecipeCard = ({ recipe, changeVisibility, type }) => {

    const navigate = useNavigate();

    const handleRecipeDetail = async (e) => {
      try {
        const idToken = await getAuth().currentUser.getIdToken(true);
        const response = await fetch(`${API_BASE_URL}/search/recipes/${recipe.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`,
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
  <Card.Root w="72" h="72" overflow="hidden"
    _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s ease-in-out' }}
    onClick={() => {
      handleRecipeDetail();
    }}
  >
      <Image w="100%" h="65%" overflow="hidden"
        src={recipe.image || recipe_default}
        alt={recipe.title}
        onError={(e) => {
          e.target.src = recipe_default;
        }}
      />
      <Card.Body gap="1" h="35%" pb={2}>
      <Flex alignItems="center" justifyContent="space-between" W="100%" h="20%">
        <Card.Title W="85%" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">{recipe.title}</Card.Title>
        <Flex alignItems="center" w="15%">
        <FaHeart color='orange'/>
          <Text fontSize="sm" ml="1">
            {recipe.likes}
          </Text>
        </Flex>
      </Flex>
        <Card.Description 
          h="80%" mt={1} 
          overflow="hidden"
          dangerouslySetInnerHTML={{ __html: recipe.summary }}
        >
        </Card.Description>
      </Card.Body>
      { type === "favourites" && 
        (<Card.Footer>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              changeVisibility();
            }}
          >
            Remove
          </Button>
      </Card.Footer>)}
    </Card.Root>
)};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    summary: PropTypes.string.isRequired,
  }).isRequired,
  changeVisibility: PropTypes.func,
  type: PropTypes.string,
};

export default RecipeCard;