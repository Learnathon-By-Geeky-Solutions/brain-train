import { Input } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const TitleSearchInput = ({controller}) => { 
    return (<Input width="80vw" color="white" placeholder="Search..." background="none" border="none" _focus={{ border: "none", boxShadow: "none" }} variant="flushed" 
      onChange={(e)=>{
        const data = {type: 'title', data: e.target.value};
        controller(data);
    }}/>) 
  };
TitleSearchInput.propTypes = {
  controller: PropTypes.func.isRequired,
};

export default TitleSearchInput;