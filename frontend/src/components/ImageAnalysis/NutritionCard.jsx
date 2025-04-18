// import {
//   Box,
//   Text,
// } from '@chakra-ui/react';
// import { useColorModeValue } from '../ui/color-mode';
// // Component for displaying nutrients
// const NutritionCard = ({ label, value, unit, min, max, standardDeviation }) => {
//     const bgColor = useColorModeValue('gray.50', 'gray.700');
    
//     return (
//       <Box p={4} bg={bgColor} borderRadius="lg" textAlign="center" boxShadow="sm">
//         <Text fontWeight="bold" fontSize="xl">{value}{unit}</Text>
//         <Text color="gray.500" fontSize="sm">{label}</Text>
//       </Box>
//     );
// };

// export default NutritionCard;

import {
  Box,
  Text,
  Stack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import { FiArrowDown, FiArrowUp, FiActivity } from 'react-icons/fi';

const NutritionCard = ({ label, obj }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const subBgColor = useColorModeValue('white', 'gray.600');
  const value = obj.value;
  const unit = obj.unit == 'calories' ? ' kcal' : obj.unit;
  const min = obj.confidenceRange95Percent.min;
  const max = obj.confidenceRange95Percent.max;
  const standardDeviation = obj.standardDeviation;

  return (
    <Box p={4} bg={bgColor} borderRadius="xl" textAlign="center" boxShadow="md">
      <Text fontWeight="bold" fontSize="2xl" mb={1}>
        {value}{unit}
      </Text>
      <Text color="gray.500" fontSize="md" mb={3}>
        {label}
      </Text>

      <Stack spacing={2} bg={subBgColor} p={3} borderRadius="lg">
        <HStack justify="space-between">
          <HStack>
            <Icon as={FiArrowDown} color="teal.400" />
            <Text fontSize="sm" color="gray.200">Min:</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="medium">{min}{unit}</Text>
        </HStack>

        <HStack justify="space-between">
          <HStack>
            <Icon as={FiArrowUp} color="red.400" />
            <Text fontSize="sm" color="gray.200">Max:</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="medium">{max}{unit}</Text>
        </HStack>

        <HStack justify="space-between">
          <HStack>
            <Icon as={FiActivity} color="purple.400" />
            <Text fontSize="sm" color="gray.200">Std Dev:</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="medium">{standardDeviation}{unit}</Text>
        </HStack>
      </Stack>
    </Box>
  );
};

export default NutritionCard;
