import { Flex, Button } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Utilities = ({ setPageState, setShowSecondBar, hideFrom, hideBelow }) => {
  const navigate = useNavigate();
  return (
    <Flex
      gap={2}
      hideBelow={hideBelow}
      hideFrom={hideFrom}
      direction={hideFrom === "md" ? "column" : "row"}
    >
      <Button
        variant="subtle"
        borderRadius="3xl"
        onClick={() => {
          setShowSecondBar(true);
          setPageState("init");
        }}
      >
        Recipe Search
      </Button>
      <Button
        variant="subtle"
        borderRadius="3xl"
        onClick={() => {
          setShowSecondBar(true);
          setPageState("ingSearch");
        }}
      >
        Pantry Match
      </Button>
      <Button
        variant="subtle"
        borderRadius="3xl"
        onClick={() => {
          navigate("/dashboard/mealPlan");
        }}
      >
        Meal Plan
      </Button>
      <Button
        variant="subtle"
        borderRadius="3xl"
        onClick={() => {
          navigate("/dashboard/imageAnalysis");
        }}
      >
        Food Image Analysis
      </Button>
    </Flex>
  );
};

export default Utilities;

Utilities.propTypes = {
  setPageState: PropTypes.func.isRequired,
  setShowSecondBar: PropTypes.func.isRequired,
  hideFrom: PropTypes.string,
  hideBelow: PropTypes.string,
};
