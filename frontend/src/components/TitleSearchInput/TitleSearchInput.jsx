import { Input } from "@chakra-ui/react";

import PropTypes from "prop-types";
import { useState } from "react";
import SuggestionContainer from "../SuggestionContainer/SuggestionContainer";
import { useColorModeValue } from "../ui/color-mode";

const TitleSearchInput = ({
  controller,
  handleSuggestionClick,
  showSecondBar,
  containerClosed,
  setContainerClosed,
}) => {
  const [query, setQuery] = useState("");
  const [keyHandlerForSuggestion, setKeyHandlerForSuggestion] = useState(null);
  const textColor = useColorModeValue("black", "white");

  function handleChange(title) {
    setQuery(title);
    const data = { type: "title", data: title };
    controller(data);
  }

  return (
    <div>
      <Input
        width="65vw"
        h="1"
        color={showSecondBar ? textColor : "teal.500"}
        textAlign={showSecondBar ? "left" : "center"}
        placeholder={showSecondBar ? "Search for a recipe" : "Search"}
        background="none"
        border="none"
        _focus={{ border: "none", boxShadow: "none" }}
        variant="flushed"
        value={query}
        fontSize={showSecondBar ? "md" : "2xl"}
        cursor={showSecondBar ? "text" : "pointer"}
        fontWeight="medium"
        readOnly={!showSecondBar}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        onKeyDown={(e) => {
          setKeyHandlerForSuggestion(e);
        }}
      />
      <SuggestionContainer
        type="title"
        query={query}
        handleClick={(title) => {
          handleChange(title);
          handleSuggestionClick();
        }}
        keyHandler={keyHandlerForSuggestion}
        containerClosed={containerClosed}
        setContainerClosed={setContainerClosed}
      />
    </div>
  );
};

TitleSearchInput.propTypes = {
  controller: PropTypes.func.isRequired,
  handleSuggestionClick: PropTypes.func.isRequired,
  containerClosed: PropTypes.bool.isRequired,
  setContainerClosed: PropTypes.func.isRequired,
  showSecondBar: PropTypes.bool.isRequired,
};

export default TitleSearchInput;
