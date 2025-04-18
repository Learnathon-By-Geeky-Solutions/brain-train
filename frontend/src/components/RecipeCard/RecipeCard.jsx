import { Image, Flex, Text, Button, Card } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import recipe_default from '../../assets/recipe_default.jpg';
import { FaHeart } from 'react-icons/fa';
import handleRecipeDetail from './api';

const RecipeCard = ({ recipe, changeVisibility, type }) => {

  const navigate = useNavigate();

  return (
  <Card.Root w="72" h="72" overflow="hidden"
    _hover={{ transform: 'scale(1.05)', transition: 'all 0.3s ease-in-out' }}
    onClick={() => {
      handleRecipeDetail(recipe.id,navigate);
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