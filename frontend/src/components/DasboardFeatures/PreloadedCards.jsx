import PropTypes from 'prop-types';
import { Flex, Text } from '@chakra-ui/react';
import RecipeCardContainer from '../RecipeCardContainer/RecipeCardContainer';

const PreloadedCards = ({txt,cards}) => {
    return (
        <Flex direction="column" width="100%" height="100%" p="4">
            <Text fontSize="2xl" fontWeight="medium" marginBottom={2} p={2}>
                {txt}
            </Text>
            <RecipeCardContainer recipe_prop={cards} perRow={10} numRows={1} />
        </Flex>
    )
}
PreloadedCards.propTypes = {
    txt: PropTypes.string.isRequired,
    cards: PropTypes.array.isRequired,
};

export default PreloadedCards;