import {
  Box,
} from '@chakra-ui/react';
import ImagePreview from './ImagePreview';
import { useColorModeValue } from '../ui/color-mode';
import UploadPhoto from './UploadPhoto';
import { uploadImageWithProgress } from './api';
import { useState, useRef } from 'react';
import { toaster } from '../ui/toaster';

const PreAnalysis = ({
    show,imagePreview,
    resetComponent,setImagePreview,setAnalysisResult,setIsAnalyzing
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
          const selectedFile = e.target.files[0];
          
          // Check if the file is an image
          if (!selectedFile.type.match('image.*')) {
            toaster.create({
              title: "Invalid file type",
              description: "Please upload an image file (JPEG, PNG, etc.)",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return;
          }
          
          // Check if the file size is below 5MB
          if (selectedFile.size > 5 * 1024 * 1024) {
            toaster.create({
              title: "File too large",
              description: "Please upload an image smaller than 5MB",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return;
          }
          
          setFile(selectedFile);
          
          // Create image preview
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target.result);
          };
          reader.readAsDataURL(selectedFile);
        }
      };
    
      const handleUpload = async () => {
        if (!file) return;
        
        setIsUploading(true);
        setUploadProgress(0);
        
        try {
          // Upload the image and track progress
          const result = await uploadImageWithProgress(file, (progress) => {
            setUploadProgress(progress);
          });
          
          if (result.success) {
            setIsAnalyzing(true);
            
            // After upload is complete, simulate analysis
            setAnalysisResult(result.imageData);
            
            toaster.create({
              title: "Analysis complete",
              description: "Your food image has been successfully analyzed!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          }
        } catch (error) {
          toaster.create({
            title: "Upload failed",
            description: error.message || "There was an error uploading your image",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setIsUploading(false);
          setIsAnalyzing(false);
        }
      };
    
      const triggerFileInput = () => {
        fileInputRef.current.click();
      };

    const backgroundColor = useColorModeValue("gray.50", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    if (!show) {
        return null;
    }
    return (
        <Box 
            p={6} 
            borderRadius="lg" 
            borderWidth="1px" 
            borderStyle="dashed" 
            borderColor={borderColor}
            bg={backgroundColor}
            textAlign="center"
        >
        <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
        />
        <UploadPhoto show={imagePreview ? false : true} triggerFileInput={triggerFileInput} />
        <ImagePreview 
            show={imagePreview ? true : false} 
            imagePreview={imagePreview} 
            isUploading={isUploading} 
            uploadProgress={uploadProgress} 
            handleUpload={handleUpload} 
            resetComponent={resetComponent}
            file={file}
        />
        </Box>
    );
};
export default PreAnalysis;