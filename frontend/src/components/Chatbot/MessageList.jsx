import React, { useRef, useEffect } from "react";
import { Box, Flex, Text, Spinner, Avatar } from "@chakra-ui/react";
import MessageItem from "./MessageItem";
import { useColorModeValue } from "../ui/color-mode";
import logo from "../../assets/logo.png";
import PropTypes from "prop-types";

const MessageList = ({ messages, isLoading, photoURL }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const bgColor = useColorModeValue("gray.50", "gray.700");

  return (
    <Flex
      direction="column"
      w="80%"
      overflowY="auto"
      borderRadius="md"
      bg="none"
      alignItems={"center"}
      pb="30vh"
      pt="6"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      }}
    >
      <Flex direction="column" w="100%">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isUser={message.isUser}
            photoURL={photoURL}
          />
        ))}
        {isLoading && (
          <Flex w="100%" justify="flex-start" mb={4}>
            <Avatar.Root size="sm" mr={2} color="white">
              <Avatar.Fallback name="AI Assistant" />
              <Avatar.Image src={logo} />
            </Avatar.Root>
            <Box maxW="70%" bg={bgColor} p={3} borderRadius="lg" boxShadow="md">
              <Spinner size="sm" color="purple.500" mr={2} />
              <Text as="span">Thinking...</Text>
            </Box>
          </Flex>
        )}
        <div ref={messagesEndRef} />
      </Flex>
    </Flex>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      isUser: PropTypes.bool.isRequired,
      imagePreview: PropTypes.arrayOf(PropTypes.string),
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
  photoURL: PropTypes.string,
};

export default MessageList;
