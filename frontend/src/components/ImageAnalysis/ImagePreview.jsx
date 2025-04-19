import {
  Box,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import PhotoUploaded from "./PhotoUploaded";
import UploadingPhoto from "./UploadingPhoto";

const ImagePreview = ({ show, imagePreview, isUploading, uploadProgress, handleUpload, resetComponent, file }) => {
    if (!show) {
        return null;
    }
    return (
        <VStack spacing={4}>
            <Box position="relative" maxW="300px" mx="auto">
                <Image 
                    src={imagePreview} 
                    alt="Food preview" 
                    borderRadius="md" 
                    objectFit="cover"
                    maxH="250px"
                />
            </Box>
            <Text fontWeight="medium">{file.name}</Text>
            <UploadingPhoto show={isUploading} uploadProgress={uploadProgress} />
            <PhotoUploaded  show={!isUploading} handleUpload={handleUpload} resetComponent={resetComponent} />  
        </VStack>
    );
};

export default ImagePreview;