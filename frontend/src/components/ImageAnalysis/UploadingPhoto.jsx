import {
  Box,
  Progress,
  Text,
} from '@chakra-ui/react';

const UploadingPhoto = ({ show, uploadProgress }) => {
    if (!show) {
        return null;
    }
    return (
        <Box w="100%">
            <Progress.Root size="lg" value={uploadProgress}>
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
export default UploadingPhoto;