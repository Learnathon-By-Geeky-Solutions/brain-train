import {
  Box,
  Image,
  Heading,
  Text,
  VStack,
  HStack,
  Separator,
  Button,
} from "@chakra-ui/react";
import { LuClock, LuHeart, LuUtensils } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import addToFavourites from "./api";
import { Toaster, toaster } from "../ui/toaster";
import DialogForShoppingList from "./DialogForShoppingList";
import { useState } from "react";
import { useColorMode } from "../ui/color-mode";

const RecipeDetails = () => {
  const location = useLocation();
  const [servingSize, setServingSize] = useState(1);
  const recipe = location.state?.recipe;
  const id = recipe._id;
  const navigate = useNavigate();

  const iconColor = useColorMode("gray.800", "gray.300");

  return (
    <Box
      maxWidth="900px"
      mx="auto"
      p={6}
      borderWidth="2px"
      borderRadius="lg"
      borderColor="gray.400"
    >
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
      <HStack spacing={4} color={iconColor} mb={4}>
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
          <Text>{recipe.likes} likes</Text>
        </HStack>
      </HStack>
      <Separator mb={4} />

      <div dangerouslySetInnerHTML={{ __html: recipe.summary }}></div>
      <Separator mb={4} />

      <Heading as="h2" size="md" mb={2}>
        Ingredients
      </Heading>
      <VStack align="start" spacing={1} mb={4}>
        {recipe.ingredients.map((ingredient) => (
          <Text key={ingredient._id}>• {ingredient.title}</Text>
        ))}
      </VStack>
      <Separator mb={4} />

      <Heading as="h2" size="md" mb={2}>
        Preparation Steps
      </Heading>
      <VStack align="start" spacing={3} mb={4}>
        <Text>
          <strong>{recipe.instructions}</strong>
        </Text>
      </VStack>
      <Separator mb="4" />

      <HStack justify="space-between" mt={4}>
        <Button
          colorScheme="teal"
          size="lg"
          onClick={() => {
            let toasterText = "Could not add recipe to favourites";
            let toasterType = "error";
            addToFavourites(recipe).then((result) => {
              if (result.status === "success") {
                toasterText = "Recipe added to favourites";
                toasterType = "success";
              }
              toaster.create({
                title: toasterText,
                type: toasterType,
              });
            });
          }}
        >
          Save Recipe
        </Button>
        <DialogForShoppingList
          handleDone={() => {
            navigate("/dashboard/shoppingList", {
              state: { id: id, servingSize: servingSize },
            });
          }}
          setServingSize={setServingSize}
          servingSize={servingSize}
        />
      </HStack>
      <Toaster />
    </Box>
  );
};

export default RecipeDetails;
