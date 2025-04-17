import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { LuCheck, LuCircleAlert, LuInfo, LuLeaf } from 'react-icons/lu';
import IngredientItem from './IngredientItem';
import NutritionCard from './NutritionCard';

const Analysis = ({ show, imagePreview, analysisResult, resetComponent }) => {
    if (!show) {
        return null;
    }
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
            <Heading as="h2" size="md" mb={2}>
                {analysisResult.foodName}
            </Heading>
            
            <Flex align="center" my={3}>
                <Box 
                borderRadius="full" 
                bg="green.100" 
                color="green.700" 
                p={2} 
                mr={3}
                >
                <LuCheck size={18} />
                </Box>
                <Text fontSize="lg" fontWeight="medium" color="green.700">
                {analysisResult.healthScore}/100 Health Score
                </Text>
            </Flex>
            
            <Text mb={2}>
                <Text as="span" fontWeight="bold">Preparation: </Text>
                {analysisResult.preparationMethod}
            </Text>
            
            <Text>
                <Text as="span" fontWeight="bold">Cuisine: </Text>
                {analysisResult.cuisineOrigin}
            </Text>
            
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
        
        <Tabs.Root colorScheme="teal" variant="enclosed">
            <Tabs.List>
            <Tabs.Trigger value='nutrition'><Box mr={2}><LuInfo size={16} /></Box> Nutrition Facts</Tabs.Trigger>
            <Tabs.Trigger value='ingredient'><Box mr={2}><LuLeaf size={16} /></Box> Ingredients</Tabs.Trigger>
            </Tabs.List>
            
            {/* Nutrition Tab */}
            <Tabs.Content value='nutrition'>
                <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4} mt={4}>
                <NutritionCard 
                    label="Calories" 
                    value={analysisResult.nutritionFacts.calories} 
                    unit="kcal" 
                />
                <NutritionCard 
                    label="Protein" 
                    value={analysisResult.nutritionFacts.protein} 
                    unit="g"
                />
                <NutritionCard 
                    label="Carbs" 
                    value={analysisResult.nutritionFacts.carbs} 
                    unit="g"
                />
                <NutritionCard 
                    label="Fat" 
                    value={analysisResult.nutritionFacts.fat} 
                    unit="g"
                />
                <NutritionCard 
                    label="Fiber" 
                    value={analysisResult.nutritionFacts.fiber} 
                    unit="g"
                />
                </SimpleGrid>
                
                <Box mt={6} p={4} bg="blue.50" borderRadius="md">
                <Flex align="center" mb={2}>
                    <LuCircleAlert size={18} color="blue" style={{ marginRight: '8px' }} />
                    <Text fontWeight="bold" color="blue.700">Important Note</Text>
                </Flex>
                <Text fontSize="sm" color="blue.700">
                    Nutritional information is estimated based on image analysis and may vary.
                    For precise dietary information, please consult nutrition labels or a dietary professional.
                </Text>
                </Box>
            </Tabs.Content>
            
            {/* Ingredients Tab */}
            <Tabs.Content value='ingredient'>
                <Box borderWidth="1px" borderRadius="md" overflow="hidden" mt={4}>
                <Box bg="gray.50" p={3} borderBottomWidth="1px">
                    <Flex justify="space-between">
                    <Text fontWeight="bold">Ingredient</Text>
                    <Text fontWeight="bold">Confidence</Text>
                    </Flex>
                </Box>
                <Box>
                    {analysisResult.ingredients.map((ingredient, index) => (
                    <IngredientItem
                        key={index}
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
            </Tabs.Content>
        </Tabs.Root>
        </Box>
    );
};

export default Analysis;