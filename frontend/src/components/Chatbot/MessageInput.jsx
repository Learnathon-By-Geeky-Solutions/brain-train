// components/MessageInput.jsx
import React, { useState } from 'react';
import { HStack, Input, IconButton, Flex } from '@chakra-ui/react';
import { LuImageUp, LuSend } from 'react-icons/lu';
import { LuRefreshCcw } from 'react-icons/lu';
import { toaster } from '../ui/toaster';
import { handleFileChange, readRawFile } from '@/services/fileHandler';
import { set } from 'react-hook-form';
import ImagePreviewWithProgress from './ImagePreviewWithProgress';


const MessageInput = ({ input, setInput, handleSendMessage, isLoading, clearChat, setFileBlob, imagePreviewState }) => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [imagePreview, setImagePreview] = imagePreviewState;
  const [showImagePreview, setShowImagePreview] = useState(false);
  const fileInputRef = React.useRef(null);
  const cancelImageUpload = () => {
    setFile(null);
    setImagePreview(null);
    setProgress(0);
    setShowImagePreview(false);
    setFileBlob(null);
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      cancelImageUpload();
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Flex w="80%" direction="column" position="absolute" bottom="17vh" bg="var(--dark-bg)" h="15vh">
    <input
        type="file"
        accept="image/*"
        onChange={(e)=>{
            const selectedFile = e.target.files[0];
            setShowImagePreview(true);
            handleFileChange(e, setFile, setImagePreview, toaster);
            readRawFile(
                selectedFile,
                (progress) => setProgress(progress),
                null
            ).then((fileBlob) => {
                setFileBlob(fileBlob);
            });
        }}
        ref={fileInputRef}
        style={{ display: 'none' }}
    />
    <Flex 
        background="var(--text-input)" 
        alignItems="center" 
        justifyContent="space-between"
        borderRadius="2xl" 
        w="100%"
        h="fit-content"
    >
        <Flex direction="column" w="100%" alignItems="center" justifyContent="center">
            {showImagePreview && (
                <ImagePreviewWithProgress base64Image={imagePreview} currentProgress={progress} cancelImage={cancelImageUpload}/>
            )}
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                flex={1}
                background="none"
                disabled={isLoading}
                border="none" 
                _focus={{ border: "none", boxShadow: "none" }} 
                variant="flushed"
                color="white"
            />
        </Flex>
        <Flex>
        <IconButton
        onClick={()=>{
            handleSendMessage();
            cancelImageUpload();
        }}
        isLoading={isLoading}
        disabled={!input.trim() || isLoading}
        variant="subtle"
        borderRadius="xl"
        mr="1"
        >
        <LuSend />
        </IconButton>
        <IconButton
        aria-label="Clear chat"
        onClick={clearChat}
        variant="subtle"
        borderRadius="xl"
        mr="1"
        >
        <LuRefreshCcw size={18} />
        </IconButton>
        <IconButton
        aria-label="Upload Image"
        onClick={()=>{
            fileInputRef.current.click();
        }}
        variant="subtle"
        borderRadius="xl"
        mr="2"
        >
        <LuImageUp size={18} />
        </IconButton>
        </Flex>
    </Flex>
    </Flex>
  );
};

export default MessageInput;