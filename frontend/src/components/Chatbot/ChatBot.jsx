// components/ChatBot.jsx
import React, { useEffect, useState } from 'react';
import {
  Flex,
  useDisclosure
} from '@chakra-ui/react';
import { Toaster, toaster } from '../ui/toaster';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { fetchAIResponse, fetchChatList } from './api';
import CollapsibleSideBar from '../CollapsibleSideBar/CollapsibleSideBar';
import SideBarContent from '../CollapsibleSideBar/SideBarContent';

const ChatBot = ({photoURL}) => {
  const { open, onToggle } = useDisclosure({ defaultIsOpen: true });
  const [messages, setMessages] = useState([
    { chatId:null, id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false, image: [], imagePreview: [] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileBlob, setFileBlob] = useState([]);
  const imagePreviewState = useState([]);
  const [imagePreview, setImagePreview] = imagePreviewState;
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    fetchChatList().then((response) => {
      if (response.status == 'error') {
        toaster.create({
          title: 'Error',
          description: response.message,
          type: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      setChatList(response.chat);
    }).catch((error) => {
      console.error('Error fetching chat list:', error);
      toaster.create({
        title: 'Error',
        description: 'Failed to fetch chat list. Please try again.',
        type: 'error',
        duration: 3000,
        isClosable: true,
      });
    });

  },[]);

  const handleSendMessage = async () => {
    if (!input.trim() && fileBlob.length > 0) return;

    const userMessage = { chatId:messages[0].chatId, id: messages.length + 1, text: input, isUser: true, image: fileBlob, imagePreview: imagePreview };
    setFileBlob([]);
    setImagePreview([]);
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetchAIResponse(input,messages[0].chatId, fileBlob);
      if (response){
        if(response.status == 'error') {
          toaster.create({
            title: 'Error',
            description: response.message,
            type: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        else{
            const chatId = response.chatId;
            if(!messages[0].chatId){
                setMessages(prev => {
                    const updatedMessages = [...prev];
                    updatedMessages[0].chatId = chatId;
                    return updatedMessages;
                });
            }
            setMessages(prev => [
                ...prev,
                { chatId:chatId, id: prev.length + 1, text: response.messages[response.messages.length-1].text, isUser: false, image: [], imagePreview:response.messages[response.messages.length-1].files  }
            ]);
        }
    }
      
    } catch (error) {
      console.error('Error fetching AI response:', error);
      toaster.create({
        title: 'Error',
        description: 'Failed to get response. Please try again.',
        type: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      { chatId:null, id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false, image: [], imagePreview: [] }
    ]);
    toaster.create({
      title: 'Chat cleared',
      type: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Flex w="100vw">
    <CollapsibleSideBar open={open} onToggle={onToggle} navItems={chatList}/>
    <Flex 
        direction="column" 
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
            setFileBlob={setFileBlob}
            imagePreviewState={imagePreviewState}
        />
        <Toaster />
    </Flex>
    </Flex>
  );
};

export default ChatBot;
