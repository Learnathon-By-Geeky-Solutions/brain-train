import { Box, Progress, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

const UploadingPhoto = ({ show, uploadProgress }) => {
  if (!show) {
    return null;
  }
  return (
    <Box w="100%">
      <Progress.Root size="lg" value={uploadProgress} colorPalette="teal">
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
      <Text fontSize="sm" color="gray.500">
        Uploading... {uploadProgress}%
      </Text>
    </Box>
  );
};
UploadingPhoto.propTypes = {
  show: PropTypes.bool.isRequired,
  uploadProgress: PropTypes.number.isRequired,
};

export default UploadingPhoto;
