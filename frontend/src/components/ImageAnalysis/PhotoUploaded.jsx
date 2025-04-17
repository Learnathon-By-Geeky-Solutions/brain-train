import {
  Button,
  Stack,
} from '@chakra-ui/react';


const PhotoUploaded = ({ show, handleUpload, resetComponent }) => {
    if (!show) {
        return null;
    }
    return (
        <Stack direction="row" spacing={4}>
            <Button 
                colorScheme="teal" 
                onClick={handleUpload}
            >
                Analyze Food
            </Button>
            <Button 
                variant="outline" 
                onClick={resetComponent}
            >
                Cancel
            </Button>
        </Stack>
    );
}
export default PhotoUploaded;