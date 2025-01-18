import { Input, IconButton, Flex, Stack, Badge } from '@chakra-ui/react';
import { LuActivity, LuAirVent, LuAlarmClockCheck, LuSearch } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

const CentralSearchFrame = ({ feature, featureProps, currentBadges, changeBadges, searchData }) => {

  const handleSearch = async (e) => {
    // e.preventDefault();
        try {
          // const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;
          const response = await fetch('http://localhost:3000/api/dummy-recipes', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${2+2}`,
              },
          });

          const data = await response.json();
          if (response.ok) {
              console.log('Fetched recipes:', data);
              navigate('/dashboard/recipes', { state: { recipes: data } });
              console.log('after navigation');
          } else {
              console.error('Failed to fetch recipes. Error code:', response.status);
          }
        } catch (err) {
            console.error("Error from central search frame", err.message);
        }
    };

    const navigate = useNavigate();
    const Feature = feature;
    if(!currentBadges) currentBadges = [];  
    const BadgesJsx = currentBadges.map((badge) => <Badge colorPalette={badge.colorPalette}>{badge.text}</Badge>);
    return (
        <Flex direction="column" maxWidth="80%" background="white" borderRadius="3xl" padding="2">
            <Flex direction="row" width="inherit">
            {  BadgesJsx }
            </Flex>
        <Feature {...featureProps} />
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

export default CentralSearchFrame;