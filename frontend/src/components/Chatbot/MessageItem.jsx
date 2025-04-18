import React from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  Image,
} from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import logo from "../../assets/logo.png";
import ImagePreviewWithProgress from './ImagePreviewWithProgress';

const MessageItem = ({ message, isUser, photoURL }) => {
  const bgColor = useColorModeValue(
    isUser ? 'blue.50' : 'gray.50',
    isUser ? 'blue.900' : 'gray.700'
  );
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bg = useColorModeValue('gray.50', 'gray.700');
  
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
      <Flex direction="column">
        <Box
          maxW="70%"
          bg={bgColor}
          p={3}
          borderRadius="lg"
          boxShadow="md"
        >
          <Text color={textColor}>{message.text}</Text>
        </Box>
        { message.imagePreview && (
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
          >
            <Image
              src={message.imagePreview}
              alt="Image Preview"
              objectFit="cover"
              w="100%"
              h="100%"
            />
          </Box>
        )}
      </Flex>
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