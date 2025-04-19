import {
  Flex,
  Text,
} from '@chakra-ui/react';


// Component for displaying ingredients with confidence score
const IngredientItem = ({ name, confidence }) => {
  const confidencePercent = Math.round(confidence * 100);
  const confidenceColor = 
    confidencePercent > 90 ? "green.500" : 
    confidencePercent > 70 ? "blue.500" : 
    confidencePercent > 50 ? "orange.500" : "red.500";
    
  return (
    <Flex 
      justifyContent="space-between" 
      alignItems="center" 
      p={2} 
      borderBottom="1px" 
      borderColor="gray.200"
    >
      <Text>{name}</Text>
      <Text color={confidenceColor} fontWeight="bold">{confidencePercent}%</Text>
    </Flex>
  );
};

export default IngredientItem;