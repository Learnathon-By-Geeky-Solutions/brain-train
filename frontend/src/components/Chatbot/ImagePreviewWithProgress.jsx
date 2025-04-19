import React from "react";
import {
  Box,
  Image,
  ProgressCircle,
  AbsoluteCenter,
  IconButton,
} from "@chakra-ui/react";

import { useColorModeValue } from "../ui/color-mode";
import { X } from "lucide-react";
import PropType from "prop-types";

const ImagePreviewWithProgress = ({
  base64Image,
  currentProgress,
  cancelImage,
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bg = useColorModeValue("gray.50", "gray.700");

  return (
    <Box
      position="relative"
      width="24"
      height="24"
      borderRadius="md"
      overflow="hidden"
      boxShadow="md"
      border="1px solid"
      borderColor={borderColor}
      bg={bg}
      zIndex={1}
    >
      <IconButton
        aria-label="Cancel upload"
        size="xs"
        position="absolute"
        top="0"
        left="16"
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
      {currentProgress < 100 && (
        <ProgressCircle.Root
          size="md"
          value={currentProgress}
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          color="white.800"
        >
          <ProgressCircle.Circle css={{ "--thickness": "4px" }}>
            <ProgressCircle.Track />
            <ProgressCircle.Range />
          </ProgressCircle.Circle>
          <AbsoluteCenter>
            <ProgressCircle.ValueText fontSize="xs" fontWeight="bold" />
          </AbsoluteCenter>
        </ProgressCircle.Root>
      )}
    </Box>
  );
};

ImagePreviewWithProgress.propTypes = {
  base64Image: PropType.string.isRequired,
  currentProgress: PropType.number.isRequired,
  cancelImage: PropType.func.isRequired,
};

export default ImagePreviewWithProgress;
