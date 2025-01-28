import { Flex, IconButton, Icon, Box, HStack } from '@chakra-ui/react';
import IngredientSearchForm from '@/components/IngredientSearchFormInput/IngredientSearchFormInput';
import { useEffect, useState } from 'react';
import RecipeCardContainer from '@/components/RecipeCardContainer/RecipeCardContainer';
import RecipeDetails from '@/components/RecipeDetails/RecipeDetails';

import './RecipeSearchUtility.css';
import CentralSearchFrame from '@/components/CentralSearchFrame/CentralSearchFrame';
import Toolbar from '@/components/Toolbar/Toolbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import TitleSearchInput from '@/components/TitleSearchInput/TitleSearchInput';
import recipes from './recipe';
import PreloadedCards from '../DasboardFeatures/PreloadedCards';
import { FaSliders } from 'react-icons/fa6';

export default function RecipeSearchUtility() {
  const [pageLocation, setPageLocation] = useState('dashboard');
  const [pageState, setPageState] = useState('init');

  function changePageState(newState) {
    setPageState(newState);
  }
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
      setPageLocation('dashboard');
    }
    else {
      setPageLocation('newValue');
    }
  }, [location]);

  const [badges, setBadges] = useState([]);
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

  return (
    <Flex direction="column" width="100%" height="100%" minHeight="100vh" alignItems="center" className="dashboard">
      {pageState === 'init' && pageLocation === 'dashboard' && (
        <Flex direction="column" width="100%" minheight="100vh" h="100%" className="dashboard">
            <Flex direction="row" h="max-content">
            <CentralSearchFrame feature={TitleSearchInput} currentBadges={badges} changeBadges={(text, color) => { modifyBadges(text, color) }} />
                <IconButton bgColor="var(--text-input)" borderRadius="3xl" padding="2" mt="6" alignSelf="center" variant="ghost">
                    <Icon>
                    <FaSliders />
                    </Icon>
                      Advanced Filter
                </IconButton>
            </Flex>
          <Toolbar click={[() => { changePageState('ingSearch') }]} />
          <PreloadedCards txt="Recently Searched" cards={recipes} />
          <PreloadedCards txt="Trending Recipes" cards={recipes} /> 
          <PreloadedCards txt="Explore a cuisine" cards={recipes} />
          <PreloadedCards txt="Recommended for You" cards={recipes} />
        </Flex>
      )}
      {
        pageState === 'ingSearch' && pageLocation === 'dashboard' && (
          <CentralSearchFrame feature={IngredientSearchForm} featureProps={{ prevState: () => { changePageState('init') }, ref: null }} currentBadges={badges} changeBadges={(text, color) => { modifyBadges(text, color) }} />
        )
      }
      <Routes>
        <Route path="recipes" element={<RecipeCardContainer />} />
        <Route path="recipe" element={<RecipeDetails />} />
      </Routes>
    </Flex>
  );
};