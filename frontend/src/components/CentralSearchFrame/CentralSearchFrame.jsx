import { Input, IconButton, Flex, Stack, Badge } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { LuActivity, LuAirVent, LuAlarmClockCheck, LuSearch } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

function handleSearchByTitle (searchData) {
     return `http://localhost:8000/search/recipes?query=${searchData.data}&fields=summary,likes`;
}

const handleSearchByIngredients = (searchData) => {
    console.log('searchData from function by ing'+searchData);
    var ingredients = '';
    var data = searchData.data;
    data.fields.forEach((field) => {
        ingredients += field.name + ',';
    });
    ingredients = ingredients.slice(0, -1);
    console.log('url from function '+`http://localhost:8000/search/recipes/ingredients?ingredients=${ingredients}&fields=summary,likes`);
    return `http://localhost:8000/search/recipes/ingredients?ingredients=${ingredients}&fields=summary,likes`;
}

const CentralSearchFrame = ({ feature, featureProps, currentBadges, changeBadges }) => {

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

    console.log("Updated searchData:", searchData);

    let url = "";
    if (searchData.type === "title") {
      url = handleSearchByTitle(searchData);
    } else if (searchData.type === "ingredients") {
      url = handleSearchByIngredients(searchData);
    }

    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${2 + 2}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          console.log("Fetched data:", data);
          console.log('Fetched recipes:', data);
          navigate('/dashboard/recipes', { state: { recipes: data.results } });
          console.log('after navigation');
        } else {
          console.error("Failed to fetch recipes. Error code:", response.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
    setShouldFetch(false); // Reset fetch trigger
  }, [searchData, shouldFetch]); // Watch for changes in searchData


    const navigate = useNavigate();
    const Feature = feature;
    const ref = useRef(null);
    if(featureProps) featureProps.ref = ref;

    if(!currentBadges) currentBadges = [];  
    const BadgesJsx = currentBadges.map((badge) => <Badge colorPalette={badge.colorPalette}>{badge.text}</Badge>);
    return (
        <Flex direction="column" maxWidth="80%" background="var(--text-input)" borderRadius="3xl" padding="2">
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