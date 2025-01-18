import {
  Box,
  Image,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  Separator,
  Stack,
  Icon,
  Button,
} from '@chakra-ui/react';
import { LuClock, LuHeart, LuUtensils } from 'react-icons/lu';

const RecipeDetails = ({ recipe }) => {
  return (
    <Box maxWidth="900px" mx="auto" p={6} borderWidth="1px" borderRadius="lg">
      <Image
        src={recipe.image}
        alt={recipe.name}
        borderRadius="lg"
        objectFit="cover"
        width="100%"
        height="350px"
        mb={4}
      />

      <Heading as="h1" size="xl" mb={2}>
        {recipe.name}
      </Heading>
      <HStack spacing={4} color="gray.600" mb={4}>
        <HStack>
          <LuClock />
          <Text>{recipe.cookTime} mins</Text>
        </HStack>
        <HStack>
          <LuUtensils />
          <Text>{recipe.servings} servings</Text>
        </HStack>
        <HStack>
          <LuHeart />
          <Text>{recipe.likes} likes</Text>
        </HStack>
      </HStack>
      <Separator mb={4} />

      {/* Recipe Description */}
      <Text fontSize="lg" mb={4} lineHeight="tall">
        {recipe.description}
      </Text>
      <Separator mb={4} />

      {/* Ingredients Section */}
      <Heading as="h2" size="md" mb={2}>
        Ingredients
      </Heading>
      <VStack align="start" spacing={1} mb={4}>
        {recipe.ingredients.map((ingredient, index) => (
          <Text key={index}>• {ingredient}</Text>
        ))}
      </VStack>
      <Separator mb={4} />

      {/* Steps Section */}
      <Heading as="h2" size="md" mb={2}>
        Preparation Steps
      </Heading>
      <VStack align="start" spacing={3} mb={4}>
        {recipe.steps.map((step, index) => (
          <Text key={index}>
            <strong>Step {index + 1}:</strong> {step}
          </Text>
        ))}
      </VStack>
      <Separator mb="4" /> 

      {/* Footer */}
      <HStack justify="space-between" mt={4}>
        <Button colorScheme="teal" size="lg">
          Save Recipe
        </Button>
        <Button variant="outline" size="lg">
          Share
        </Button>
      </HStack>
    </Box>
  );
};

export default RecipeDetails;
