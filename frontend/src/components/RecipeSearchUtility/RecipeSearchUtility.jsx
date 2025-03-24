import { Flex } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import IngredientSearchForm from '@/components/IngredientSearchFormInput/IngredientSearchFormInput';
import { useState } from 'react';
import RecipeDetails from '@/components/RecipeDetails/RecipeDetails';

import './RecipeSearchUtility.css';
import CentralSearchFrame from '@/components/CentralSearchFrame/CentralSearchFrame';
import Toolbar from '@/components/Toolbar/Toolbar';
import { Route, Routes } from 'react-router-dom';
import TitleSearchInput from '@/components/TitleSearchInput/TitleSearchInput';
import FilterController from './filter';


export default function RecipeSearchUtility(
  { pageState, setPageState, pageLocation, 
    showResults, setSearchParams,
    filters, setShowSecondBar, showSecondBar
  }
) {
  // const [filters, setFilters] = useState([]);

  function changePageState(newState) {
    setSearchParams({});
    setPageState(newState);
  }

  // function addFilter(filter) {
  //   const newFilters = [...filters];
  //   for (const f of filter) {
  //     newFilters.push(f);
  //   }
  //   setFilters(newFilters);
  // }

  // function clearFilters() {
  //   setFilters([]);
  // }

  return (
    <Flex direction="column" width="100%" minHeight="16" alignItems="center" mb="6">

      {( pageState === 'init' || !showSecondBar ) && pageLocation === 'dashboard' && (
          <Flex direction="row" h="100%" gap={2} onClick={() => setShowSecondBar(true)}>
            <CentralSearchFrame 
              feature={TitleSearchInput} 
              featureProps={{ handleSuggestionClick: null }}
              filters={filters}
              showResults={showResults}
            />
            {/* <FilterController 
              addFilter={addFilter} 
              clearFilters={clearFilters}
            /> */}
          </Flex>
        )
      }

      {
        pageState === 'ingSearch' && pageLocation === 'dashboard' && showSecondBar && (
          <CentralSearchFrame
            feature={IngredientSearchForm}
            featureProps={{ prevState: () => { changePageState('init') }, ref: null }}
            filters={filters}
            showResults={showResults}
          />
        )
      }
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