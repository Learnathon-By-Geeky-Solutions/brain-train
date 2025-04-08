import { IconButton, Flex } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import PropTypes from 'prop-types';
import DummySearchBar from '../RecipeSearchUtility/DummySearchBar';


const CentralSearchFrame = ({ feature, featureProps, filters, showResults }) => {

  const [shouldFetch, setShouldFetch] = useState(false);
  const [searchData, setSearchData] = useState({type:'', data:{}});
  const [containerClosed, setContainerClosed] = useState(false);

  const handleSearch = () => {
    console.log("Triggering form submission...");
    if(ref.current)
      ref.current.requestSubmit(); // Trigger form submission
    console.log(searchData);
    setShouldFetch(true); // Indicate that we should proceed once state updates
  };

  useEffect(() => {
    if (!shouldFetch) return;

    searchData.filters = filters;
    showResults(searchData);
    setShouldFetch(false); // Reset fetch trigger
  }, [searchData, shouldFetch]); // Watch for changes in searchData


    const Feature = feature;
    const ref = useRef(null);

    if(featureProps?.ref == null) featureProps.ref = ref;
    if(featureProps?.handleSuggestionClick == null) 
      featureProps.handleSuggestionClick = () => {
        handleSearch();
      }
    

    return (
        <Flex 
          direction="row" background="var(--text-input)" 
          borderRadius="4xl" padding="2" ml={6} mr={6} alignItems="center"
          shadow="lg" shadowColor="bg.panel"
        >
        <Feature {...featureProps} 
          controller={setSearchData}
          containerClosed={containerClosed}
          setContainerClosed={setContainerClosed}
        />
        {/* <IconButton variant="subtle" borderRadius="full" size="lg" marginLeft="auto"
          alignSelf="start"
          onClick={()=>{
            handleSearch();
            setContainerClosed(true);
          }}
        >
          <LuSearch />
        </IconButton> */}
      </Flex>
    )
}

CentralSearchFrame.defaultProps = {
  featureProps: {},
  currentBadges: [],
};

CentralSearchFrame.propTypes = {
  feature: PropTypes.elementType.isRequired,
  featureProps: PropTypes.object,
  currentBadges: PropTypes.array,
  changeBadges: PropTypes.func.isRequired,
  showResults: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
};

export default CentralSearchFrame;