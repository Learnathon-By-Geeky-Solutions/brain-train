import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { LuCircleAlert } from "react-icons/lu";
import NutritionCard from "./NutritionCard";
import PropTypes from "prop-types";

const NutritionAnalysis = ({ analysisResult }) => {
  return (
    <div>
      <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4} mt={4} gap={4}>
        <NutritionCard
          label="Calories"
          obj={analysisResult.nutrition.calories}
        />
        <NutritionCard label="Protein" obj={analysisResult.nutrition.protein} />
        <NutritionCard label="Carbs" obj={analysisResult.nutrition.carbs} />
        <NutritionCard label="Fat" obj={analysisResult.nutrition.fat} />
      </SimpleGrid>

      <Box mt={6} p={4} bg="blue.50" borderRadius="md">
        <Flex align="center" mb={2}>
          <LuCircleAlert
            size={18}
            color="blue"
            style={{ marginRight: "8px" }}
          />
          <Text fontWeight="bold" color="blue.700">
            Important Note
          </Text>
        </Flex>
        <Text fontSize="sm" color="blue.700">
          Nutritional information is estimated based on image analysis and may
          vary. For precise dietary information, please consult nutrition labels
          or a dietary professional.
        </Text>
      </Box>
    </div>
  );
};

NutritionAnalysis.propTypes = {
  analysisResult: PropTypes.shape({
    nutrition: PropTypes.shape({
      calories: PropTypes.object.isRequired,
      protein: PropTypes.object.isRequired,
      carbs: PropTypes.object.isRequired,
      fat: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
};

export default NutritionAnalysis;
