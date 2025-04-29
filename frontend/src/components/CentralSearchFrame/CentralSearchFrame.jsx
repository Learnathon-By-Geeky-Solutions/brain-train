import { IconButton, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import PropTypes from "prop-types";
import { useColorModeValue } from "../ui/color-mode";

const CentralSearchFrame = ({
  feature,
  featureProps,
  filters,
  showResults,
  containerClosed,
  setContainerClosed,
}) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [searchData, setSearchData] = useState({ type: "", data: {} });
  const bgColor = useColorModeValue("white", "var(--text-input)");
  const searchButtonColor = useColorModeValue("green", "primary");

  const handleSearch = () => {
    if (ref.current) ref.current.requestSubmit(); // Trigger form submission
    setShouldFetch(true); // Indicate that we should proceed once state updates
  };

  useEffect(() => {
    if (!shouldFetch) return;

    searchData.filters = filters;
    showResults(searchData);
    setShouldFetch(false);
  }, [searchData, shouldFetch]);

  const Feature = feature;
  const ref = useRef(null);

  if (featureProps?.ref == null) featureProps.ref = ref;
  if (featureProps?.handleSuggestionClick == null)
    featureProps.handleSuggestionClick = () => {
      handleSearch();
      setContainerClosed(true);
    };

  return (
    <Flex
      direction="row"
      background={bgColor}
      borderRadius="4xl"
      padding="2"
      ml={6}
      mr={6}
      alignItems="center"
      shadow="md"
      shadowColor="bg.panel"
    >
      <Feature
        {...featureProps}
        controller={setSearchData}
        containerClosed={containerClosed}
        setContainerClosed={setContainerClosed}
      />
      <IconButton
        variant="subtle"
        borderRadius="full"
        size="lg"
        marginLeft="auto"
        alignSelf="start"
        colorPalette={searchButtonColor}
        onClick={() => {
          handleSearch();
          setContainerClosed(true);
        }}
      >
        <LuSearch />
      </IconButton>
    </Flex>
  );
};

CentralSearchFrame.defaultProps = {
  featureProps: {},
};

CentralSearchFrame.propTypes = {
  feature: PropTypes.elementType.isRequired,
  featureProps: PropTypes.object,
  showResults: PropTypes.func.isRequired,
  filters: PropTypes.array,
  containerClosed: PropTypes.bool.isRequired,
  setContainerClosed: PropTypes.func.isRequired,
};

export default CentralSearchFrame;
