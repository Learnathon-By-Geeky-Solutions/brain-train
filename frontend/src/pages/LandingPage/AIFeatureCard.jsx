import { Box, Flex, Text, Heading, Image, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

function AIFeatureCard({
  icon,
  title,
  description,
  image,
  isReversed = false,
  delay = 0,
}) {
  return (
    <Flex
      direction={{ base: "column", md: isReversed ? "row-reverse" : "row" }}
      align="center"
      justify="space-between"
      mb={20}
    >
      <MotionBox
        w={{ base: "100%", md: "48%" }}
        mb={{ base: 10, md: 0 }}
        initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
      >
        <MotionFlex align="center" mb={4}>
          <Box p={3} bg="teal.50" borderRadius="full" mr={4}>
            <Icon as={icon} color="teal.500" w={6} h={6} />
          </Box>
          <Heading
            as="h3"
            fontSize={{ base: "xl", md: "2xl" }}
            color="gray.800"
          >
            {title}
          </Heading>
        </MotionFlex>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
          {description}
        </Text>
      </MotionBox>

      <MotionBox
        w={{ base: "100%", md: "48%" }}
        initial={{ opacity: 0, x: isReversed ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.2 }}
      >
        <Image src={image} alt={title} borderRadius="xl" shadow="xl" w="full" />
      </MotionBox>
    </Flex>
  );
}

export default AIFeatureCard;

AIFeatureCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  isReversed: PropTypes.bool,
  delay: PropTypes.number,
};
