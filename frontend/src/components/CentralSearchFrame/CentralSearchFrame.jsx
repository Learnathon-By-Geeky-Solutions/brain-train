import { Input, IconButton, Flex, Stack, Badge } from '@chakra-ui/react';
import { useState } from 'react';
import { LuActivity, LuAirVent, LuAlarmClockCheck, LuSearch } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

function handleSearchByTitle (searchData) {
     return `http://localhost:8000/search/recipes?query=${searchData.data}&fields=summary,likes`;
}

const handleSearchByIngredients = (searchData) => {
    var ingredients = '';
    var data = searchData.data;
    data.fields.forEach((field) => {
        ingredients += field.name + ',';
    });
    ingredients = ingredients.slice(0, -1);
    return `http://localhost:8000/search/recipes/ingredients?ingredients=${ingredients}&fields=summary,likes`;
}

const CentralSearchFrame = ({ feature, featureProps, currentBadges, changeBadges }) => {

  const handleSearch = async (e) => {
        console.log(searchData);
        let url = '';
        if(searchData.type === 'title'){
            url = handleSearchByTitle(searchData);
        }
        else if(searchData.type === 'ingredients'){
            url = handleSearchByIngredients(searchData);
        }
        try {
          const response = await fetch(url, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${2+2}`,
              },
          });

          const data = await response.json();
          if (response.ok) {
              console.log('Fetched recipes:', data);
              if(searchData.type === 'title') navigate('/dashboard/recipes', { state: { recipes: data.results } });
              else if(searchData.type === 'ingredients') navigate('/dashboard/recipes', { state: { recipes: data } });
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

    const [searchData, setSearchData] = useState({type:'', data:{}});

    if(!currentBadges) currentBadges = [];  
    const BadgesJsx = currentBadges.map((badge) => <Badge colorPalette={badge.colorPalette}>{badge.text}</Badge>);
    return (
        <Flex direction="column" maxWidth="80%" background="white" borderRadius="3xl" padding="2">
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

export default CentralSearchFrame;