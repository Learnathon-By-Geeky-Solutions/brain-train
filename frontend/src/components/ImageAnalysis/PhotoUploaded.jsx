import { Button, Stack } from "@chakra-ui/react";
import PropTypes from "prop-types";

const PhotoUploaded = ({ show, handleUpload, resetComponent }) => {
  if (!show) {
    return null;
  }
  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" spacing={4}>
        <Button colorPalette="teal" onClick={() => handleUpload("ingredient")}>
          Detect Ingredients
        </Button>
        <Button colorPalette="teal" onClick={() => handleUpload("nutrition")}>
          Analyze Nutrition
        </Button>
      </Stack>
      <Button variant="outline" onClick={resetComponent}>
        Cancel
      </Button>
    </Stack>
  );
};

PhotoUploaded.propTypes = {
  show: PropTypes.bool.isRequired,
  handleUpload: PropTypes.func.isRequired,
  resetComponent: PropTypes.func.isRequired,
};

export default PhotoUploaded;
