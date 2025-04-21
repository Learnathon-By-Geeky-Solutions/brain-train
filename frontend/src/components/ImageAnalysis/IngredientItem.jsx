import { Flex, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

// Component for displaying ingredients with confidence score
const IngredientItem = ({ name, confidence }) => {
  const confidencePercent = Math.round(confidence * 100);
  let confidenceColor;

  if (confidencePercent > 90) {
    confidenceColor = "green.500";
  } else if (confidencePercent > 70) {
    confidenceColor = "blue.500";
  } else if (confidencePercent > 50) {
    confidenceColor = "orange.500";
  } else {
    confidenceColor = "red.500";
  }

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      p={2}
      borderBottom="1px"
      borderColor="gray.200"
    >
      <Text>{name}</Text>
      <Text color={confidenceColor} fontWeight="bold">
        {confidencePercent}%
      </Text>
    </Flex>
  );
};

IngredientItem.propTypes = {
  name: PropTypes.string.isRequired,
  confidence: PropTypes.number.isRequired,
};

export default IngredientItem;
