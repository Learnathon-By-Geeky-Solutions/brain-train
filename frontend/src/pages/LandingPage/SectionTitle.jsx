import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

// Motion components
const MotionBox = motion(Box);

function SectionTitle({ title, subtitle, light = false }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      mb={8}
      textAlign="center"
    >
      <Heading
        as="h2"
        fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
        fontWeight="bold"
        color={light ? "white" : "gray.800"}
        mb={3}
      >
        {title}
      </Heading>
      <Flex justify="center">
        <Box h="2px" w="60px" bg="orange.400" mb={4} />
      </Flex>
      <Text
        fontSize={{ base: "md", md: "lg" }}
        color={light ? "gray.100" : "gray.600"}
        maxW="700px"
        mx="auto"
      >
        {subtitle}
      </Text>
    </MotionBox>
  );
}

export default SectionTitle;

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  light: PropTypes.bool,
};
