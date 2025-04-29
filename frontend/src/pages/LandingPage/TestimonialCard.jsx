import { Box, Flex, Text, Avatar } from "@chakra-ui/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const MotionBox = motion(Box);

function TestimonialCard({ name, role, quote, avatar, delay = 0 }) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      bg="white"
      p={8}
      borderRadius="lg"
      shadow="md"
      _hover={{
        shadow: "lg",
        transform: "translateY(-5px)",
      }}
      // transition="all 0.3s ease"
    >
      <Box as="span" fontSize="4xl" color="gray.200" mb={5} display="block">
        &ldquo;
      </Box>
      <Text fontSize="md" color="gray.600" mb={6} fontStyle="italic">
        {quote}
      </Text>
      <Flex align="center">
        <Avatar.Root size="md" mr={4}>
          <Avatar.Fallback name="testimonial" />
          <Avatar.Image src={avatar} />
        </Avatar.Root>
        <Box>
          <Text fontWeight="bold" fontSize="md">
            {name}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {role}
          </Text>
        </Box>
      </Flex>
    </MotionBox>
  );
}

export default TestimonialCard;

TestimonialCard.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  quote: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  delay: PropTypes.number,
};
