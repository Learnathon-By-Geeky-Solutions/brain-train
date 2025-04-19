import {
    Box,
    Flex,
    SimpleGrid,
    Text,
} from '@chakra-ui/react';
import { LuCircleAlert } from 'react-icons/lu';
import NutritionCard from './NutritionCard';

const NutritionAnalysis = ({ analysisResult }) => {
    return (
        <div>
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
        </div>
    )
};

export default NutritionAnalysis;

