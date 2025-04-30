import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Badge,
  Container,
  Card,
  Flex,
  IconButton,
  List,
  Separator,
  Spinner,
} from "@chakra-ui/react";
import { getShoppingList } from "./api";
import { useLocation } from "react-router-dom";
import { useColorModeValue } from "../ui/color-mode";
import { LuPrinter } from "react-icons/lu";

const ShoppingList = () => {
  const [data, setData] = useState(null);
  const location = useLocation();
  const id = location.state?.id;
  const servingSize = location.state?.servingSize;

  useEffect(() => {
    getShoppingList(servingSize, id).then((data) => {
      setData(data);
    });
  }, []);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  if (!data || data.status === "error") {
    return (
      <VStack justify="center" align="center">
        <Spinner size="xl" colorPalette="teal" />
        <Text fontSize="lg" color="gray.500">
          {data?.message || "Loading..."}
        </Text>
      </VStack>
    );
  }

  const groupedItems = {};
  data.shoppingList.forEach((item) => {
    if (!groupedItems[item.title]) {
      groupedItems[item.title] = [];
    }
    groupedItems[item.title].push(item);
  });

  return (
    <Container maxW="container.md" py={6}>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="lg">Shopping List</Heading>
          <HStack>
            <Badge
              colorScheme="green"
              fontSize="md"
              px={2}
              py={1}
              borderRadius="md"
            >
              {data.servings} Servings
            </Badge>
            <IconButton
              aria-label="Print shopping list"
              size="sm"
              colorScheme="blue"
              variant="outline"
              onClick={() => window.print()}
            >
              <LuPrinter />
            </IconButton>
          </HStack>
        </Flex>

        <Separator size="lg" />

        <List.Root gap={4} variant="plain">
          {Object.entries(groupedItems).map(([title, items]) => (
            <List.Item key={title}>
              <Card.Root
                variant="outline"
                bg={bgColor}
                borderColor={borderColor}
                borderWidth="1px"
                borderRadius="md"
                overflow="hidden"
                boxShadow="sm"
                _hover={{ boxShadow: "md" }}
                transition="box-shadow 0.2s"
                w="100%"
              >
                <Card.Body p={0}>
                  <Flex>
                    <Box w="80px" h="80px" overflow="hidden">
                      <Image
                        src={items[0].image}
                        alt={title}
                        objectFit="cover"
                        w="100%"
                        h="100%"
                        fallbackSrc="https://via.placeholder.com/80?text=No+Image"
                      />
                    </Box>
                    <Flex flex="1" p={4} justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" noOfLines={1}>
                          {title}
                        </Text>
                        {items.map((item) => (
                          <Text key={item.id} fontSize="sm" color="gray.300">
                            {item.amount} {item.unit}
                          </Text>
                        ))}
                      </VStack>
                    </Flex>
                  </Flex>
                </Card.Body>
              </Card.Root>
            </List.Item>
          ))}
        </List.Root>
      </VStack>
    </Container>
  );
};

export default ShoppingList;
