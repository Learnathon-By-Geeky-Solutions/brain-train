import {
  Box,
  Input,
} from "@chakra-ui/react";

import PropTypes from 'prop-types';
import { useState } from "react";
import SuggestionContainer from "../SuggestionContainer/SuggestionContainer";

const TitleSearchInput = ({controller}) => {

  const [query, setQuery] = useState("");

  function handleClick(title){
    setQuery(title);
    const data = {type: 'title', data: title};
    controller(data);
  }

  return (
    <Box>
    <Input width="80vw" color="white" placeholder="Search..." background="none" border="none" _focus={{ border: "none", boxShadow: "none" }} variant="flushed"
      value={query}
      fontSize="md"
      fontWeight="medium"
      onChange={(e)=>{
        handleClick(e.target.value);
      }}
    />
    <SuggestionContainer type="title" query={query} handleClick={handleClick}/>
    </Box>
  ) 
};

TitleSearchInput.propTypes = {
  controller: PropTypes.func.isRequired,
};


export default TitleSearchInput;