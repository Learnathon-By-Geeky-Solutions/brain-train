import { Flex, IconButton, Icon } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import IngredientSearchForm from '@/components/IngredientSearchFormInput/IngredientSearchFormInput';
import { useState } from 'react';
import RecipeDetails from '@/components/RecipeDetails/RecipeDetails';

import './RecipeSearchUtility.css';
import CentralSearchFrame from '@/components/CentralSearchFrame/CentralSearchFrame';
import Toolbar from '@/components/Toolbar/Toolbar';
import { Route, Routes } from 'react-router-dom';
import TitleSearchInput from '@/components/TitleSearchInput/TitleSearchInput';
import { FaSliders } from 'react-icons/fa6';
import FilterController from './filter';


export default function RecipeSearchUtility({ pageState, setPageState, pageLocation, showResults, setSearchParams }) {
  const [badges, setBadges] = useState([]);
  const [filters, setFilters] = useState([]);

  function changePageState(newState) {
    setSearchParams({});
    setPageState(newState);
  }

  function modifyBadges(text, colorPalette) {
    const newBadges = [...badges];
    if (newBadges.find((badge) => badge.text === text)) {
      newBadges.splice(newBadges.findIndex((badge) => badge.text === text), 1);
      setBadges(newBadges);
      return;
    }
    newBadges.push({ text: text, colorPalette: colorPalette });
    setBadges(newBadges);
  }

  function addFilter(filter) {
    const newFilters = [...filters];
    for (const f of filter) {
      newFilters.push(f);
    }
    setFilters(newFilters);
  }

  function removeFilter(filter) {
    const newFilters = [...filters];
    newFilters.splice(newFilters.findIndex((f) => f === filter), 1);
    setFilters(newFilters);
  }

  function clearFilters() {
    setFilters([]);
  }

  return (
    <Flex direction="column" width="100%" height="100%" alignItems="center" className="dashboard">

      {pageState === 'init' && pageLocation === 'dashboard' && (
          <Flex direction="column" width="100%" minheight="100vh" h="100%" className="dashboard">
              <Flex direction="row" h="max-content">
              <CentralSearchFrame 
                feature={TitleSearchInput} 
                featureProps={{ handleSuggestionClick: null }}
                filters={filters}
                currentBadges={badges} 
                changeBadges={
                  (text, color) => { modifyBadges(text, color) }
                }
                showResults={showResults}
              />
                  {/* <IconButton bgColor="var(--text-input)" borderRadius="3xl" padding="2" mt="6" alignSelf="center" variant="ghost">
                      <Icon>
                      <FaSliders />
                      </Icon>
                        Advanced Filter
                  </IconButton> */}
                  <FilterController 
                    addFilter={addFilter} 
                    clearFilters={clearFilters}
                  />
              </Flex>
            <Toolbar click={[() => { changePageState('ingSearch') }]} />
            {/* <PreloadedCards txt="Recently Searched" cards={recipes} />
            <PreloadedCards txt="Trending Recipes" cards={recipes} /> 
            <PreloadedCards txt="Explore a cuisine" cards={recipes} />
            <PreloadedCards txt="Recommended for You" cards={recipes} /> */}
          </Flex>
        )
      }

      {
        pageState === 'ingSearch' && pageLocation === 'dashboard' && (
          <CentralSearchFrame
            feature={IngredientSearchForm}
            featureProps={{ prevState: () => { changePageState('init') }, ref: null }}
            filters={filters}
            currentBadges={badges} 
            changeBadges={(text, color) => { modifyBadges(text, color) }}
            showResults={showResults}
          />
        )
      }

      <Routes>
        <Route path="recipe" element={<RecipeDetails />} />
      </Routes>
    </Flex>
  );
};


RecipeSearchUtility.propTypes = {
  pageState: PropTypes.string.isRequired,
  setPageState: PropTypes.func.isRequired,
  pageLocation: PropTypes.string.isRequired,
  showResults: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired,
};