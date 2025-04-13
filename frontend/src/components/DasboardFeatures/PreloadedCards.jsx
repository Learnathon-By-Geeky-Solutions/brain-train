import PropTypes from 'prop-types';
import { Flex, Text } from '@chakra-ui/react';
import RecipeCardContainer from '../RecipeCardContainer/RecipeCardContainer';
import { getRecentRecipes, getRecommendedRecipes, getTrendingRecipes } from './api';
import { useEffect, useState } from 'react';
import ExploreCuisine from './ExploreCuisine';

const PreloadedCards = ({txt,cards,showResults = null}) => {
    const [newCards, setNewCards] = useState(cards);
    useEffect(() => {
        let fn;
        if( txt === "Recently Searched" ){
            fn = getRecentRecipes;
        }
        else if( txt === "Recommended for You" ){
            fn = getRecommendedRecipes;
        }
        else if( txt === "Trending Recipes" ){
            fn = getTrendingRecipes;
        }

        fn?.(7).then((data) => {
            if(data.status != "error")
                setNewCards(data.results);
            else
                console.log(data.msg);
        });
    }
    ,[]);
    
    return (
        
        <Flex direction="column" width="100%" height="100%" p="4" px="2">
            <Text fontSize="2xl" fontWeight="medium" marginBottom={2} p={2} px="4">
                {txt}
            </Text>
            { txt!=="Explore a cuisine" ? 
            (<RecipeCardContainer recipe_prop={newCards} perRow={10} numRows={1} containerType="carousel" />)
            : 
            (<ExploreCuisine showResults={showResults}/>)
            }
        </Flex> 
    );
}
PreloadedCards.propTypes = {
    txt: PropTypes.string.isRequired,
    cards: PropTypes.array.isRequired,
};

export default PreloadedCards;