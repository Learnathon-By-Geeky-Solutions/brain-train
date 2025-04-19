// components/MessageInput.jsx
import React, { useState } from 'react';
import { Input, IconButton, Flex } from '@chakra-ui/react';
import { LuImageUp, LuSend } from 'react-icons/lu';
import { LuRefreshCcw } from 'react-icons/lu';
import { toaster } from '../ui/toaster';
import { handleFileChange, readRawFile } from '@/services/fileHandler';
import ImagePreviewWithProgress from './ImagePreviewWithProgress';


const MessageInput = ({ input, setInput, handleSendMessage, isLoading, clearChat, setFileBlob, imagePreviewState }) => {
  const [file, setFile] = useState([]);
  const [progress, setProgress] = useState([]);
  const [imagePreview, setImagePreview] = imagePreviewState;
  const [showImagePreview, setShowImagePreview] = useState([]);
  const fileInputRef = React.useRef(null);

  const cancelImageUpload = (index) => {
    if (index !== undefined) {
      setFile((prev) => prev.filter((_, i) => i !== index));
      setImagePreview((prev) => prev.filter((_, i) => i !== index));
      setProgress((prev) => prev.filter((_, i) => i !== index));
      setShowImagePreview((prev) => prev.filter((_, i) => i !== index));
      setFileBlob((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
    imagePreview.forEach((_, index) => {
        cancelImageUpload(index);
    });
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Flex w="80%" direction="column" position="absolute" bottom="0" bg="var(--dark-bg)" h="20vh">
    <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e)=>{
            const selectedFiles = e.target.files;
            setProgress(Array(selectedFiles.length).fill(0));
            setShowImagePreview(Array(selectedFiles.length).fill(false));
            handleFileChange(e, setFile, setImagePreview, toaster);
            for( let i = 0; i < selectedFiles.length; i++ ){
                setShowImagePreview((prev) => {
                    const newShowImagePreview = [...prev];
                    newShowImagePreview[i] = true;
                    return newShowImagePreview;
                });
                const selectedFile = selectedFiles[i];
                readRawFile(
                    selectedFile,
                    (progress) => setProgress((prev) => {
                        const newProgress = [...prev];
                        newProgress[i] = progress;
                        return newProgress;
                    }),
                    null
                ).then((fileBlob) => {
                    setFileBlob((prev) => [...prev, fileBlob]);
                });
            }
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
        position="absolute" bottom="17vh"
    >
        <Flex direction="column" w="100%"  justifyContent="center">
            <Flex alignItems="center">
            {showImagePreview.map((show,index) => {
                if(show) return (
                <ImagePreviewWithProgress
                    key={imagePreview[index]}
                    base64Image={imagePreview[index]}
                    currentProgress={progress[index]}
                    cancelImage={() => cancelImageUpload(index)}
                />)
            })}
            </Flex>
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
        <Flex alignSelf="flex-end" mb="2.5">
        <IconButton
        onClick={()=>{
            handleSendMessage();
            imagePreview.forEach((_, index) => {
                cancelImageUpload(index);
            });
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