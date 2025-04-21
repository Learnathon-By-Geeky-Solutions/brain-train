// components/markdown/MarkdownComponents.js
import React from "react";
import { Box, Code, Heading, Link, List, Text } from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";

export const useMarkdownComponents = () => {
  const codeBg = useColorModeValue("gray.100", "gray.800");

  return {
    h1: ({ children }) => (
      <Heading as="h1" size="xl" my={2}>
        {children}
      </Heading>
    ),
    h2: ({ children }) => (
      <Heading as="h2" size="lg" my={2}>
        {children}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading as="h3" size="md" my={2}>
        {children}
      </Heading>
    ),
    p: ({ children }) => <Text mb={2}>{children}</Text>,
    strong: ({ children }) => (
      <Text as="strong" fontWeight="bold">
        {children}
      </Text>
    ),
    em: ({ children }) => (
      <Text as="em" fontStyle="italic">
        {children}
      </Text>
    ),
    a: ({ href, children }) => (
      <Link color="teal.300" href={href} isExternal>
        {children}
      </Link>
    ),
    ul: ({ children }) => (
      <List.Root pl={4} mb={2}>
        {children}
      </List.Root>
    ),
    ol: ({ children }) => (
      <List.Root as="ol" pl={4} mb={2}>
        {children}
      </List.Root>
    ),
    li: ({ children }) => <List.Item mb={1}>{children}</List.Item>,
    blockquote: ({ children }) => (
      <Box
        pl={4}
        borderLeft="4px solid"
        borderColor="gray.500"
        color="gray.400"
        my={2}
      >
        {children}
      </Box>
    ),
    code({ inline, className, children, ...props }) {
      const lang = className?.replace("language-", "") || "";
      if (inline) {
        return (
          <Code bg={codeBg} px={1} borderRadius="md" fontSize="sm" {...props}>
            {children}
          </Code>
        );
      }
      return (
        <Box
          as="pre"
          bg={codeBg}
          p={3}
          my={2}
          rounded="md"
          overflowX="auto"
          fontSize="sm"
          whiteSpace="pre-wrap"
        >
          <Code className={className} language={lang} {...props}>
            {children}
          </Code>
        </Box>
      );
    },
    table: ({ children }) => (
      <Box as="table" width="100%" borderCollapse="collapse" my={4}>
        {children}
      </Box>
    ),
    thead: ({ children }) => (
      <Box as="thead" bg="gray.600" color="white">
        {children}
      </Box>
    ),
    tbody: ({ children }) => <Box as="tbody">{children}</Box>,
    tr: ({ children }) => (
      <Box
        as="tr"
        borderBottom="1px solid"
        borderColor="gray.200"
        _last={{ borderBottom: "none" }}
      >
        {children}
      </Box>
    ),
    th: ({ children }) => (
      <Box
        as="th"
        p={2}
        fontWeight="bold"
        borderBottom="1px solid"
        borderColor="gray.300"
      >
        {children}
      </Box>
    ),
    td: ({ children }) => (
      <Box as="td" p={2} borderBottom="1px solid" borderColor="gray.100">
        {children}
      </Box>
    ),
  };
};
