import { IconButton, Flex, Badge } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { LuActivity, LuAirVent, LuAlarmClockCheck, LuSearch } from 'react-icons/lu';
import PropTypes from 'prop-types';


const CentralSearchFrame = ({ feature, featureProps, currentBadges, changeBadges, showResults}) => {

  const [shouldFetch, setShouldFetch] = useState(false);
  const [searchData, setSearchData] = useState({type:'', data:{}});

  const handleSearch = () => {
    console.log("Triggering form submission...");
    if(ref.current)
      ref.current.requestSubmit(); // Trigger form submission
    setShouldFetch(true); // Indicate that we should proceed once state updates
  };

  useEffect(() => {
    if (!shouldFetch) return;

    showResults(searchData);
    setShouldFetch(false); // Reset fetch trigger
  }, [searchData, shouldFetch]); // Watch for changes in searchData

    const Feature = feature;
    const ref = useRef(null);
    if(featureProps) featureProps.ref = ref;

    if(!currentBadges) currentBadges = [];  
    const BadgesJsx = currentBadges.map((badge) => <Badge key={badge.id} colorPalette={badge.colorPalette}>{badge.text}</Badge>);
    return (
        <Flex direction="column" maxWidth="80%" background="var(--text-input)" borderRadius="3xl" padding="2" m={6} marginBottom={0}>
            <Flex direction="row" width="inherit">
            {  BadgesJsx }
            </Flex>
        <Feature {...featureProps} controller={setSearchData}/>
        <Flex direction="row">
          <IconButton aria-label="Activity" variant="ghost" borderRadius="full" size="sm" onClick={()=>{
            changeBadges('Activity', 'pink');
          }}>
            <LuActivity colorScheme="dark" />
          </IconButton>
          <IconButton aria-label="Alarm" variant="ghost" borderRadius="full" size="sm" onClick={()=>
            changeBadges('Alarm', 'pink')
          }>
            <LuAlarmClockCheck />
          </IconButton>
          <IconButton aria-label="Alarm" variant="ghost" borderRadius="full" size="sm" onClick={()=>
            changeBadges('Airvent', 'pink')
          }>
            <LuAirVent />
          </IconButton>
          <IconButton aria-label="Alarm" variant="ghost" borderRadius="full" size="sm" marginLeft="auto" onClick={()=>{
            handleSearch();
          }}>
            <LuSearch />
          </IconButton>
        </Flex>
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
};

export default CentralSearchFrame;