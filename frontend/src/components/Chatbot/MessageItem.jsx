import React from "react";
import { Box, Flex, Avatar, Image } from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";
import logo from "../../assets/logo.png";
import ChatMarkdown from "./ChatMarkDown";
import PropType from "prop-types";

const MessageItem = ({ message, isUser, photoURL }) => {
  const bgColor = useColorModeValue(
    isUser ? "blue.50" : "gray.50",
    isUser ? "blue.900" : "gray.700",
  );
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bg = useColorModeValue("gray.50", "gray.700");

  return (
    <Flex w="100%" justify={isUser ? "flex-end" : "flex-start"} mb={4}>
      {!isUser && (
        <Avatar.Root size="sm" mr={2} color="white">
          <Avatar.Fallback name="AI Assistant" />
          <Avatar.Image src={logo} />
        </Avatar.Root>
      )}
      <Flex direction="column" alignItems={isUser ? "flex-end" : "flex-start"}>
        {message?.text && (
          <Box w="90%" bg={bgColor} p={4} borderRadius="lg" boxShadow="md">
            <ChatMarkdown content={message.text} />
          </Box>
        )}
        {message.imagePreview.map((image) => (
          <Box
            position="relative"
            width="28"
            height="28"
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
            border="1px solid"
            borderColor={borderColor}
            bg={bg}
            key={image}
          >
            <Image
              src={image}
              alt="Image Preview"
              objectFit="cover"
              w="100%"
              h="100%"
            />
          </Box>
        ))}
      </Flex>
      {isUser && (
        <Avatar.Root size="sm" bg="blue.500" ml="2">
          <Avatar.Fallback name="User" />
          <Avatar.Image src={photoURL} />
        </Avatar.Root>
      )}
    </Flex>
  );
};

MessageItem.propTypes = {
  message: PropType.shape({
    text: PropType.string.isRequired,
    imagePreview: PropType.arrayOf(PropType.string).isRequired,
  }).isRequired,
  isUser: PropType.bool.isRequired,
  photoURL: PropType.string.isRequired,
};

export default MessageItem;
