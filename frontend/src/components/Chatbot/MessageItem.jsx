import React from 'react';
import {
  Box,
  Flex,
  Text,
  HStack,
  Avatar,
  IconButton,
} from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import { LuThumbsDown, LuThumbsUp } from 'react-icons/lu';
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
        
        {!isUser && (
          <HStack mt={2} justify="flex-end" spacing={1}>
            <IconButton
              aria-label="Thumbs Up"
              size="xs"
              variant="ghost"
              onClick={() => alert('Feedback: Thumbs Up')}
            >
              <LuThumbsUp size={16} />
            </IconButton>
            <IconButton
              aria-label="Thumbs Down"
              size="xs"
              variant="ghost"
              onClick={() => alert('Feedback: Thumbs Down')}
            >
                <LuThumbsDown size={16} />
            </IconButton>
          </HStack>
        )}
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