import React from 'react';
import {
  Box,
  Image,
  ProgressCircle,
  AbsoluteCenter,
  IconButton,
} from '@chakra-ui/react';

import { useColorModeValue } from '../ui/color-mode';
import { X } from 'lucide-react';

const ImagePreviewWithProgress = ({ base64Image, currentProgress, cancelImage }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box
      position="relative"
      width="12"
      height="12"
      borderRadius="md"
      overflow="hidden"
      boxShadow="md"
      border="1px solid"
      borderColor={borderColor}
      bg={bg}
    >
       <IconButton
        aria-label="Cancel upload"
        size="xs"
        position="absolute"
        top={0}
        left={4}
        colorPalette="red"
        variant="subtle"
        borderRadius="full"
        onClick={cancelImage}
        zIndex={2}
      >
        <X size={3} />
      </IconButton>
      <Image
        src={base64Image}
        alt="Image Preview"
        objectFit="cover"
        w="100%"
        h="100%"
      />
      <ProgressCircle.Root 
        size="xs"
        value={currentProgress}
        thickness="6px"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        color="purple.400"
      >
            <ProgressCircle.Circle>
              <ProgressCircle.Track />
              <ProgressCircle.Range />
            </ProgressCircle.Circle>
            <AbsoluteCenter>
              <ProgressCircle.ValueText fontSize="sm" fontWeight="bold"/>
            </AbsoluteCenter>
          </ProgressCircle.Root>
    </Box>
  );
};

export default ImagePreviewWithProgress;


