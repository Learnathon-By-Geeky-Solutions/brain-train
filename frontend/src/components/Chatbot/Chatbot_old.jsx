import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  Text,
  VStack,
  HStack,
  Avatar,
  Spinner,
  IconButton,
} from '@chakra-ui/react';
import { Toaster, toaster } from '../ui/toaster';
import { useColorModeValue } from '../ui/color-mode';
import MessageItem from './MessageItem';
import { fetchAIResponse } from './api';
import { LuRefreshCcw, LuSend } from 'react-icons/lu';
import logo from "../../assets/logo.png";



const ChatBot_old = ({photoURL}) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { id: messages.length + 1, text: input, isUser: true };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await fetchAIResponse(input);
      
      // Add AI response to chat
      setMessages(prev => [
        ...prev, 
        { id: prev.length + 1, text: response.content, isUser: false }
      ]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      toaster.create({
        title: 'Error',
        description: 'Failed to get response. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false }
    ]);
    toaster.create({
      title: 'Chat cleared',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    // <Container maxW="container.md" h="100vh" py={4}>
      <VStack h="90vh" spacing={4} top="10vh" py="4" px="6" bg="none">
        {/* Messages container */}
        <Box
          flex={1}
          w="full"
          overflowY="auto"
          p={3}
          borderRadius="md"
          bg="none"
        >
          <VStack spacing={4} align="stretch">
            {messages.map(message => (
              <MessageItem
                key={message.id} 
                message={message} 
                isUser={message.isUser}
                photoURL={photoURL} 
              />
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
                <Box
                  maxW="70%"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  p={3}
                  borderRadius="lg"
                  boxShadow="md"
                >
                  <Spinner size="sm" color="purple.500" mr={2} />
                  <Text as="span">Thinking...</Text>
                </Box>
              </Flex>
            )}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>
        
        {/* Input area */}
        <HStack w="full" spacing={2}>
        <Flex 
            background="var(--text-input)" 
            alignItems="center" 
            justifyContent="space-between"
            borderRadius="2xl" 
            w="95%"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            size="md"
            flex={1}
            background="none"
            disabled={isLoading}
            border="none" 
            _focus={{ border: "none", boxShadow: "none" }} 
            variant="flushed"
            color="white"
          />
          <IconButton
            onClick={handleSendMessage}
            isLoading={isLoading}
            disabled={!input.trim() || isLoading}
            variant="subtle"
            borderRadius="xl"
            mr="2"
          >
            <LuSend />
          </IconButton>
          </Flex>
          <IconButton
            aria-label="Clear chat"
            onClick={clearChat}
            variant="subtle"
            borderRadius="xl"
            w="5%"
          >
            <LuRefreshCcw size={18} />
          </IconButton>
        </HStack>
        <Toaster/>
      </VStack>
  );
};

export default ChatBot_old;