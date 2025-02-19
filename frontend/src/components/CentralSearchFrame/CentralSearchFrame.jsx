import { IconButton, Flex, Badge } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { LuActivity, LuAirVent, LuAlarmClockCheck, LuSearch } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";


function handleSearchByTitle (searchData) {
  return `${API_BASE_URL}/search/recipes?query=${searchData.data}&fields=summary,likes,title,image`;
}

const handleSearchByIngredients = (searchData) => {
    console.log('searchData from function by ing'+searchData);
    let ingredients = '';
    let data = searchData.data;
    data.fields.forEach((field) => {
        ingredients += field.name + ',';
    });
    ingredients = ingredients.slice(0, -1);
    console.log('url from function '+`${API_BASE_URL}/search/recipes/ingredients?ingredients=${ingredients}&fields=summary,likes,title,image`);
    return `${API_BASE_URL}/search/recipes/ingredients?ingredients=${ingredients}&fields=summary`;

}

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

    // let url = "";
    // if (searchData.type === "title") {
    //   url = handleSearchByTitle(searchData);
    // } else if (searchData.type === "ingredients") {
    //   url = handleSearchByIngredients(searchData);
    // }

    // const fetchData = async () => {
    //   try {
    //     const response = await fetch(url, {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${2 + 2}`,
    //       },
    //     });
    //     const data = await response.json();
    //     if (response.ok) {
    //       // navigate('/dashboard/recipes', { state: { recipes: data.results } });
    //       showResults(data.results);
    //     } else {
    //       console.error("Failed to fetch recipes. Error code:", response.status);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching data:", error.message);
    //   }
    // };

    showResults(searchData);
    setShouldFetch(false); // Reset fetch trigger
  }, [searchData, shouldFetch]); // Watch for changes in searchData


    const navigate = useNavigate();
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
};

export default CentralSearchFrame;