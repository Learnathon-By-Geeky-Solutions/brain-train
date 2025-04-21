import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { LuCamera, LuUpload } from "react-icons/lu";
import PropTypes from "prop-types";

const UploadPhoto = ({ show, triggerFileInput }) => {
  if (!show) {
    return null;
  }
  return (
    <VStack spacing={4}>
      <Box
        w="100px"
        h="100px"
        borderRadius="full"
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mx="auto"
      >
        <LuCamera size={40} color="gray" />
      </Box>
      <Text>Drag and drop your food image here or</Text>
      <Button colorScheme="teal" onClick={triggerFileInput}>
        <LuUpload size={16} />
        Browse files
      </Button>
    </VStack>
  );
};

UploadPhoto.propTypes = {
  show: PropTypes.bool.isRequired,
  triggerFileInput: PropTypes.func.isRequired,
};

export default UploadPhoto;
