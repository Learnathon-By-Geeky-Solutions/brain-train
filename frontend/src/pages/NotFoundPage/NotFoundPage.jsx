import React from "react";
import {
  Box,
  Container,
  Text,
  Heading,
  Button,
  Link,
  Center,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { ChefHat, Home } from "lucide-react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const NotFoundPage = ({ route }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Check if there are any search parameters
  const hasSearchParams = searchParams.toString().length > 0;
  if (hasSearchParams) return null;

  return (
    <Box minH="100vh" bg="none">
      {/* Main Content */}
      <Container maxW="container.md" pt={{ base: 8, md: 14 }} pb={20}>
        <VStack spacing={8} align="center" textAlign="center">
          {/* 404 Text */}
          <Box position="relative">
            <Text
              fontSize={{ base: "7xl", md: "9xl" }}
              fontWeight="bold"
              lineHeight="1"
              color="orange.400"
            >
              404
            </Text>
          </Box>

          {/* Message */}
          <Heading
            as="h1"
            fontSize={{ base: "2xl", md: "4xl" }}
            fontWeight="bold"
            color="gray.800"
          >
            Page Not Found
          </Heading>

          <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="md">
            We couldn&apos;t find the resource you were looking for. It may have
            been removed or the link might be broken.
          </Text>

          {/* Chef Hat Icon */}
          <Center my={6}>
            <Icon
              as={ChefHat}
              w={{ base: 16, md: 24 }}
              h={{ base: 16, md: 24 }}
              color="gray.400"
            />
          </Center>

          {/* Home Button - The only interactive element */}
          <Button
            leftIcon={<Icon as={Home} />}
            colorPalette="orange"
            size="lg"
            rounded="full"
            as={Link}
            href={route}
            _hover={{ textDecoration: "none" }}
          >
            Return to Home
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default NotFoundPage;

NotFoundPage.propTypes = {
  route: PropTypes.string,
};
