// components/MessageList.jsx
import React, { useRef, useEffect } from 'react';
import { Box, VStack, Flex, Text, Spinner, Avatar } from '@chakra-ui/react';
import MessageItem from './MessageItem';
import { useColorModeValue } from '../ui/color-mode';
import logo from "../../assets/logo.png";

const MessageList = ({ messages, isLoading, photoURL }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Flex direction="column" w="80%" overflowY="auto" borderRadius="md" bg="none" alignItems={"center"} pb="25vh">
      <Flex direction="column" w="100%"
        css={{
            "&::-webkit-scrollbar": {
              display: "none", 
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none", 
          }}
      >
        {messages.map(message => (
          <MessageItem key={message.id} message={message} isUser={message.isUser} photoURL={photoURL} />
        ))}
        {isLoading && (
          <Flex w="100%" justify="flex-start" mb={4}>
            <Avatar.Root 
                size="sm" 
                mr={2} 
                color="white" 
            >
                <Avatar.Fallback name="AI Assistant" />
                <Avatar.Image src={logo} />
            </Avatar.Root>
            <Box maxW="70%" bg={useColorModeValue('gray.50', 'gray.700')} p={3} borderRadius="lg" boxShadow="md">
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

export default MessageList;