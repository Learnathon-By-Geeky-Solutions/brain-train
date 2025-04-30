import { Box, Flex, Text, Heading, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const MotionBox = motion(Box);

function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      p={6}
      bg="white"
      borderRadius="lg"
      shadow="md"
      _hover={{
        transform: "translateY(-5px)",
        shadow: "lg",
        borderTop: "3px solid",
        borderColor: "orange.400",
      }}
    >
      <Flex
        w="60px"
        h="60px"
        borderRadius="full"
        bg="teal.50"
        justify="center"
        align="center"
        mb={4}
      >
        <Icon as={icon} w={6} h={6} color="teal.500" />
      </Flex>
      <Heading as="h3" fontSize="xl" mb={3} fontWeight="bold">
        {title}
      </Heading>
      <Text color="gray.600">{description}</Text>
    </MotionBox>
  );
}

export default FeatureCard;

FeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  delay: PropTypes.number,
};
