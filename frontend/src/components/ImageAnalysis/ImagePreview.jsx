import { Box, Image, Text, VStack } from "@chakra-ui/react";
import PhotoUploaded from "./PhotoUploaded";
import UploadingPhoto from "./UploadingPhoto";
import PropTypes from "prop-types";

const ImagePreview = ({
  show,
  imagePreview,
  isUploading,
  uploadProgress,
  handleUpload,
  resetComponent,
  file,
}) => {
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
      <PhotoUploaded
        show={!isUploading}
        handleUpload={handleUpload}
        resetComponent={resetComponent}
      />
    </VStack>
  );
};

ImagePreview.propTypes = {
  show: PropTypes.bool.isRequired,
  imagePreview: PropTypes.string.isRequired,
  isUploading: PropTypes.bool.isRequired,
  uploadProgress: PropTypes.number.isRequired,
  handleUpload: PropTypes.func.isRequired,
  resetComponent: PropTypes.func.isRequired,
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default ImagePreview;
