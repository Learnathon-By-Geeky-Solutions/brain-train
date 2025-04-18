import {
  Box,
} from '@chakra-ui/react';
import ImagePreview from './ImagePreview';
import { useColorModeValue } from '../ui/color-mode';
import UploadPhoto from './UploadPhoto';
import { uploadImageWithProgressIngredients, uploadImageWithProgressNutrition } from './api';
import { useState, useRef } from 'react';
import { toaster } from '../ui/toaster';

const PreAnalysis = ({
    show,imagePreview,
    resetComponent,setImagePreview,
    setAnalysisResult,setIsAnalyzing
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileBlob, setFileBlob] = useState(null);
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
    
    const handleUpload = async (type) => {
      if (!file) return;
      setIsUploading(true);
      readRawFile(
        file,
        (progress) => setUploadProgress(progress),
        (fileBlob) => setFileBlob(fileBlob)
      ).then((completeFile)=>{
         try {
          const Fn = (type === "ingredient") ? uploadImageWithProgressIngredients : uploadImageWithProgressNutrition;
          console.log("completeFile");
          console.log(completeFile);
          Fn(completeFile).then((response) => {
            if(response?.status == 'error'){
              console.log("error in response");
            }
            else{
              response.type = type;
              console.log(response);
              setIsAnalyzing(true);
              setIsUploading(false);
              setAnalysisResult(response);

              
              toaster.create({
                title: "Analysis complete",
                description: "Your food image has been successfully analyzed!",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            }
          });
      } catch (error) {
        toaster.create({
          title: "Upload failed",
          description: error.message || "There was an error uploading your image",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsAnalyzing(false);
      }
      });
      
    };
  
    const triggerFileInput = () => {
      fileInputRef.current.click();
    };

    const readRawFile = (file, onProgress, onComplete) => {
      const CHUNK_SIZE = 1024 * 100; // 100KB
      return new Promise((resolve, reject) => {
        const totalSize = file.size;
        let offset = 0;
        const chunkList = [];

        const reader = new FileReader();

        const readNextChunk = () => {
          const slice = file.slice(offset, offset + CHUNK_SIZE);
          reader.readAsArrayBuffer(slice);
        };

        reader.onload = (e) => {
          chunkList.push(new Uint8Array(e.target.result));
          offset += CHUNK_SIZE;
          const percent = Math.min((offset / totalSize) * 100, 100);
          if (onProgress) onProgress(percent);

          if (offset < totalSize) {
            readNextChunk();
          } else {
            // Combine chunks into one Blob
            const completeBlob = new Blob(chunkList, { type: file.type });


            // Optionally wrap it as a File object (if filename is needed)
            const completeFile = new File([completeBlob], file.name, { type: file.type });

            if (onComplete) onComplete(completeBlob);
            resolve(completeFile);
          }
        };

        reader.onerror = () => reject(reader.error);

        readNextChunk();
      });
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
            resetComponent={()=>{
                resetComponent()
                setFile(null);
                setUploadProgress(0);
                setIsUploading(false);
            }}
            file={file}
        />
        </Box>
    );
};
export default PreAnalysis;