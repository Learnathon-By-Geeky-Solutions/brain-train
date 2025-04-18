// components/MessageInput.jsx
import React from 'react';
import { HStack, Input, IconButton, Flex } from '@chakra-ui/react';
import { LuSend } from 'react-icons/lu';
import { LuRefreshCcw } from 'react-icons/lu';


const MessageInput = ({ input, setInput, handleSendMessage, isLoading, clearChat }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
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
  );
};

export default MessageInput;