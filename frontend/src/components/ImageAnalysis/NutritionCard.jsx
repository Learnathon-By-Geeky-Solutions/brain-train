import {
  Box,
  Text,
} from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
// Component for displaying nutrients
const NutritionCard = ({ label, value, unit }) => {
    const bgColor = useColorModeValue('gray.50', 'gray.700');
    
    return (
      <Box p={4} bg={bgColor} borderRadius="lg" textAlign="center" boxShadow="sm">
        <Text fontWeight="bold" fontSize="xl">{value}{unit}</Text>
        <Text color="gray.500" fontSize="sm">{label}</Text>
      </Box>
    );
};

export default NutritionCard;