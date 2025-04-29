import { Box } from "@chakra-ui/react";
import ImagePreview from "./ImagePreview";
import { useColorModeValue } from "../ui/color-mode";
import UploadPhoto from "./UploadPhoto";
import {
  uploadImageWithProgressIngredients,
  uploadImageWithProgressNutrition,
} from "./api";
import { useState, useRef } from "react";
import { toaster } from "../ui/toaster";
import PropType from "prop-types";
import { readRawFile, handleFileChange } from "@/services/fileHandler";

const PreAnalysis = ({
  show,
  imagePreview,
  resetComponent,
  setImagePreview,
  setAnalysisResult,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    handleFileChange(e, setImagePreview, toaster, false, setFile);
  };

  const handleUpload = async (type) => {
    if (!file) return;
    setIsUploading(true);
    readRawFile(file, (progress) => setUploadProgress(progress), null).then(
      (completeFile) => {
        try {
          const Fn =
            type === "ingredient"
              ? uploadImageWithProgressIngredients
              : uploadImageWithProgressNutrition;
          console.log("completeFile");
          console.log(completeFile);
          Fn(completeFile).then((response) => {
            if (response?.status == "error") {
              console.log("error in response");
            } else {
              response.type = type;
              console.log(response);
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
            description:
              error.message || "There was an error uploading your image",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      },
    );
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
        onChange={handleFileSelect}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <UploadPhoto
        show={imagePreview === null}
        triggerFileInput={triggerFileInput}
      />
      <ImagePreview
        show={imagePreview !== null}
        imagePreview={imagePreview}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        handleUpload={handleUpload}
        resetComponent={() => {
          resetComponent();
          setFile(null);
          setUploadProgress(0);
          setIsUploading(false);
        }}
        file={file}
      />
    </Box>
  );
};

PreAnalysis.propTypes = {
  show: PropType.bool.isRequired,
  imagePreview: PropType.string,
  resetComponent: PropType.func.isRequired,
  setImagePreview: PropType.func.isRequired,
  setAnalysisResult: PropType.func.isRequired,
};

export default PreAnalysis;
