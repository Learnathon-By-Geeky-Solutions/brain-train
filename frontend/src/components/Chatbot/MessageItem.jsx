import React from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
} from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import logo from "../../assets/logo.png";

const MessageItem = ({ message, isUser, photoURL }) => {
  const bgColor = useColorModeValue(
    isUser ? 'blue.50' : 'gray.50',
    isUser ? 'blue.900' : 'gray.700'
  );
  const textColor = useColorModeValue('gray.800', 'white');
  
  return (
    <Flex w="100%" justify={isUser ? "flex-end" : "flex-start"} mb={4}>
      {!isUser && (
        <Avatar.Root 
            size="sm" 
            mr={2} 
            color="white" 
        >
            <Avatar.Fallback name="AI Assistant" />
            <Avatar.Image src={logo} />
        </Avatar.Root>
      )}
      <Box
        maxW="70%"
        bg={bgColor}
        p={3}
        borderRadius="lg"
        boxShadow="md"
      >
        <Text color={textColor}>{message.text}</Text>
      </Box>
      {isUser && (
        <Avatar.Root 
            size="sm" 
            ml={2} 
            bg="blue.500" 
        >
            <Avatar.Fallback name="User" />
            <Avatar.Image src={photoURL} />
        </Avatar.Root>
      )}
    </Flex>
  );
};

export default MessageItem;