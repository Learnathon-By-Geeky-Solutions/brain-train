import {
  Box,
  Input,
} from "@chakra-ui/react";

import PropTypes from 'prop-types';
import { useState } from "react";
import SuggestionContainer from "../SuggestionContainer/SuggestionContainer";

const TitleSearchInput = ({controller,handleSuggestionClick}) => {

  const [query, setQuery] = useState("");
  const [keyHandlerForSuggestion, setKeyHandlerForSuggestion] = useState(null);

  function handleChange(title){
    setQuery(title);
    const data = {type: 'title', data: title};
    controller(data);
  }

  return (
    <div>
    <Input width="65vw" h="1" color="white" placeholder="Search..." background="none" border="none" _focus={{ border: "none", boxShadow: "none" }} variant="flushed"
      value={query}
      fontSize="md"
      fontWeight="medium"
      onChange={(e)=>{
        handleChange(e.target.value);
      }}
      onKeyDown={(e)=>{
        setKeyHandlerForSuggestion(e);
      }}
    />
    <SuggestionContainer type="title" query={query} 
      handleClick={
        (title)=>{
          handleChange(title);
          handleSuggestionClick();
        }
      }
      keyHandler={keyHandlerForSuggestion}
    />
    </div>
  ) 
};

TitleSearchInput.propTypes = {
  controller: PropTypes.func.isRequired,
  handleSuggestionClick: PropTypes.func.isRequired,
};


export default TitleSearchInput;