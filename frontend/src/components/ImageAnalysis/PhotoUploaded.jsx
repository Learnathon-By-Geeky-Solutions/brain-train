import {
  Button,
  Stack,
} from '@chakra-ui/react';


const PhotoUploaded = ({ show, handleUpload, resetComponent }) => {
    if (!show) {
        return null;
    }
    return (
        <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={4}>
                <Button 
                    colorPalette="teal" 
                    onClick={()=>handleUpload('ingredient')}
                >
                    Detect Ingredients
                </Button>
                <Button 
                    colorPalette="teal" 
                    onClick={()=>handleUpload('nutrition')}
                >
                    Analyze Nutrition
                </Button>
            </Stack>
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