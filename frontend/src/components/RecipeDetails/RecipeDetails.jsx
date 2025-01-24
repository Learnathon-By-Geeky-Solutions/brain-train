import {
  Box,
  Image,
  Heading,
  Text,
  VStack,
  HStack,
  Separator,
  Button,
} from '@chakra-ui/react';
import { LuClock, LuHeart, LuUtensils } from 'react-icons/lu';
import { useLocation } from 'react-router-dom';

const RecipeDetails = () => {
  const location = useLocation();
  const recipe = location.state?.recipe;
  return (
    <Box maxWidth="900px" mx="auto" p={6} borderWidth="2px" borderRadius="lg" borderColor="gray.400">
      <Image
        src={recipe.image}
        alt={recipe.title}
        borderRadius="lg"
        objectFit="cover"
        width="100%"
        height="350px"
        mb={4}
      />

      <Heading as="h1" size="xl" mb={2}>
        {recipe.title}
      </Heading>
      <HStack spacing={4} color="gray.300" mb={4}>
        <HStack>
          <LuClock />
          <Text>{recipe.readyInMinutes} mins</Text>
        </HStack>
        <HStack>
          <LuUtensils />
          <Text>{recipe.servings} servings</Text>
        </HStack>
        <HStack>
          <LuHeart />
          <Text>{recipe.aggregateLikes} likes</Text>
        </HStack>
      </HStack>
      <Separator size="lg" mb={4} />

      {/* Recipe Description */}
      {/* <Text fontSize="lg" mb={4} lineHeight="tall">
        {recipe.summary}
      </Text> */}
      <div dangerouslySetInnerHTML={{__html:recipe.summary}}></div>
      <Separator size="lg" mb={4} />

      {/* Ingredients Section */}
      <Heading as="h2" size="md" mb={2}>
        Ingredients
      </Heading>
      <VStack align="start" spacing={1} mb={4}>
        {recipe.extendedIngredients.map((ingredient) => (
          <Text key={ingredient.id}>• {ingredient.name}</Text>
        ))}
      </VStack>
      <Separator size="lg" mb={4} />

      {/* Steps Section */}
      <Heading as="h2" size="md" mb={2}>
        Preparation Steps
      </Heading>
      <VStack align="start" spacing={3} mb={4}>
        <Text>
            <strong>{recipe.instructions}</strong> 
        </Text>
      </VStack>
      <Separator size="lg" mb="4" /> 

      {/* Footer */}
      <HStack justify="space-between" mt={4}>
        <Button colorScheme="teal" size="lg">
          Save Recipe
        </Button>
        <Button variant="outline" size="lg" borderColor="gray.400">
          Share
        </Button>
      </HStack>
    </Box>
  );
};

export default RecipeDetails;
