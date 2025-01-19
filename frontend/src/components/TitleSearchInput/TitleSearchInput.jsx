import { Input } from '@chakra-ui/react';

const TitleSearchInput = ({controller}) => { 
    return (<Input width="80vw" color="white" placeholder="Search..." background="none" border="none" _focus={{ border: "none", boxShadow: "none" }} variant="flushed" 
      onChange={(e)=>{
        const data = {type: 'title', data: e.target.value};
        controller(data);
    }}/>) 
  };

export default TitleSearchInput;