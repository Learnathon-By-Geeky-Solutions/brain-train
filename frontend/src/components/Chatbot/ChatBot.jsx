// components/ChatBot.jsx
import React, { useState } from 'react';
import {
    Flex,
  VStack,
  Box,
  useDisclosure
} from '@chakra-ui/react';
import { Toaster, toaster } from '../ui/toaster';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { fetchAIResponse } from './api';
import CollapsibleSideBar from '../CollapsibleSideBar/CollapsibleSideBar';
import { calcLength } from 'framer-motion';

const ChatBot = ({photoURL}) => {
  const { open, onToggle } = useDisclosure({ defaultIsOpen: true });
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: messages.length + 1, text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetchAIResponse(input);
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
    <Flex w="100vw">
    <CollapsibleSideBar open={open} onToggle={onToggle}/>
    <Flex 
        direction="column" 
        area-label="boka-choda"
        bg="none" 
        position="fixed" 
        left={open ? "25vw" : "5vw"} 
        h="100%" 
        alignItems="center"
        justifyContent="center"
        w={open ? "75vw" : "95vw"}
    >
        <MessageList messages={messages} isLoading={isLoading} photoURL={photoURL} />
        <MessageInput
            input={input}
            setInput={setInput}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            clearChat={clearChat}
        />
        <Toaster />
    </Flex>
    </Flex>
  );
};

export default ChatBot;
