import {
  Box,
  Button,
  Collapsible,
  Flex,
  Heading,
  Image,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuCheck, LuCircleAlert } from 'react-icons/lu';
import IngredientItem from './IngredientItem';
import NutritionAnalysis from './NutritionAnalysis';
import { useState } from 'react';
import fetchData from '@/pages/Dashboard/api';
import RecipeCardContainer from '../RecipeCardContainer/RecipeCardContainer';

const Analysis = ({ show, imagePreview, analysisResult, resetComponent }) => {
    if (!show) {
        return null;
    }

    function initCap(str) {
        return str
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
      
    const type = analysisResult.type ;
    const buttonName = type === 'nutrition' ? 'View Similar Food Recipes' : 'View Recipes with Detected Ingredients';

    return  (
        <Box>
        <Flex 
            direction={{ base: "column", md: "row" }}
            gap={6}
            mb={6}
        >
            <Box 
            flex="1" 
            borderRadius="lg" 
            overflow="hidden"
            boxShadow="md"
            maxW={{ base: "100%", md: "250px" }}
            >
            <Image 
                src={imagePreview} 
                alt="Analyzed food" 
                w="100%" 
                objectFit="cover"
            />
            </Box>
            
            <Box flex="2">
            <Heading size="2xl" mb={2}>
                {type === 'nutrition' ? initCap(analysisResult.category.name) : 'Ingredient Detection Result'}
            </Heading>
            
            { type === 'nutrition' && ( 
                <Flex align="center" my={3}>
                    <Box 
                        borderRadius="full" 
                        bg={analysisResult.category.probability * 100 > 50 ? "green.100" : "red.100"} 
                        color="green.700" 
                        p={2} 
                        mr={3}
                    >
                        <LuCheck size={18} />
                    </Box>
                    <Text 
                        fontSize="lg" 
                        fontWeight="medium" 
                        color={analysisResult.category.probability * 100 > 50 ? "green.700" : "red.700"}
                    >
                    {analysisResult.category.probability.toFixed(4) * 100}% Probability
                    </Text>
                </Flex>
            )}
            
            <Button 
                colorScheme="blue" 
                mt={4} 
                size="sm"
                onClick={resetComponent}
            >
                Analyze Another Image
            </Button>
            </Box>
        </Flex>
        { type === 'nutrition' ? (
            <NutritionAnalysis analysisResult={analysisResult} />
        ) : (
            <div>
            <Box borderWidth="1px" borderRadius="md" overflow="hidden" mt={4}>
            <Box bg="gray.400" borderBottomWidth="1px" p="4">
                <Flex justify="space-between">
                <Text fontWeight="bold">Ingredient</Text>
                <Text fontWeight="bold">Confidence</Text>
                </Flex>
            </Box>
            <Box bg="gray.700" boxShadow="md" p={4}>
                {analysisResult.ingredients.map((ingredient) => (
                <IngredientItem
                    key={ingredient.name}
                    name={ingredient.name}
                    confidence={ingredient.confidence}
                />
                ))}
            </Box>
            </Box>
            
            <Box mt={6} p={4} bg="blue.50" borderRadius="md">
            <Flex align="center" mb={2}>
                <LuCircleAlert size={18} color="blue" style={{ marginRight: '8px' }} />
                <Text fontWeight="bold" color="blue.700">Ingredient Detection</Text>
            </Flex>
            <Text fontSize="sm" color="blue.700">
                Ingredients are detected using computer vision and may not capture all components,
                especially spices and smaller ingredients. Higher confidence percentages indicate 
                more reliable detection.
            </Text>
            </Box>
            </div>
        )}
        {/* <Flex direction="column" alignItems="center" justifyContent="center" my={6}> */}
        <Collapsible.Root colorPalette="teal">
            <Collapsible.Trigger value={type}>
                <Button my="6">
                    {buttonName}
                </Button>
            </Collapsible.Trigger>
            <Collapsible.Content value={type} mx="-2">
                <RecipeCardContainer recipe_prop={analysisResult.results} />
            </Collapsible.Content>
        </Collapsible.Root>
        {/* </Flex> */}
        </Box>
    );
};

export default Analysis;