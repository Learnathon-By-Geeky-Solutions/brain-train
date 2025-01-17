import { Box, Flex, Icon, IconButton, Span, Image, Input, Heading } from '@chakra-ui/react';
import DynamicForm from '@/components/DynamicFormInput/DynamicFormInput';
import { useEffect, useState } from 'react';
import { LuSearch, LuActivity, LuAlarmClockCheck } from 'react-icons/lu';
import RecipeCardContainer from '@/components/RecipeCardContainer/RecipeCardContainer';
import RecipeDetails from '@/components/RecipeDetails/RecipeDetails';

import './Dashboard.css';
import CentralSearchFrame from '@/components/CentralSearchFrame/CentralSearchFrame';
import Toolbar from '@/components/Toolbar/Toolbar';
import { text } from '@fortawesome/fontawesome-svg-core';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';


const generateDummyRecipes = () => {
  return Array.from({ length: 5 }, (_, i) => ({
    name: `Recipe ${i + 1}`,
    image: `https://picsum.photos/200/150?random=${i + 1}`,
    description: `This is a description for Recipe ${i + 1}. It's a delicious dish that you will love.`,
  }));
};

const recipe = {
    name: 'Spaghetti Carbonara',
    image: 'https://picsum.photos/800/600?random=1',
    description:
      'This classic Italian pasta dish combines creamy eggs, Parmesan cheese, pancetta, and pepper to create a rich and flavorful meal.',
    cookTime: 30,
    servings: 4,
    likes: 250,
    ingredients: [
      '200g spaghetti',
      '100g pancetta',
      '2 large eggs',
      '50g Parmesan cheese',
      '2 cloves garlic',
      'Salt and pepper to taste',
    ],
    steps: [
      'Cook the spaghetti in boiling salted water until al dente.',
      'Fry the pancetta in a pan until crispy.',
      'Beat the eggs and mix with grated Parmesan cheese.',
      'Drain the pasta and mix with pancetta and garlic.',
      'Turn off the heat and quickly mix in the egg mixture.',
      'Serve with additional Parmesan and freshly ground pepper.',
    ],
  };


export default function Dashboard() {
    const [pageLocation, setPageLocation] = useState('dashboard');
    const [pageState, setPageState] = useState('init');
    const recipes = generateDummyRecipes();
    const navigate = useNavigate();

    const navigateToRecipes = () => {
      navigate('/dashboard/recipes');
    }  

    function changePageState(newState){
        setPageState(newState);
    }
    const location = useLocation();

    useEffect(() => {
      if ( location.pathname === '/dashboard' || location.pathname === '/dashboard/' ){
        setPageLocation('dashboard');
      }
      else{
        setPageLocation('newValue');
      }
      console.log(location.pathname);
    }, [location]);

    const mainSearchBar = () => { return ( <Input width="80vw" placeholder="Search..." background="none" border="none" _focus={{border: "none", boxShadow: "none"}} variant="flushed" /> ) };
    const [ badges, setBadges ] = useState([]);
    function modifyBadges(text, colorPalette){
      const newBadges = [...badges];
      if(newBadges.find((badge) => badge.text === text)){
        newBadges.splice(newBadges.findIndex((badge) => badge.text === text), 1);
        setBadges(newBadges);
        return;
      }
      newBadges.push({text: text, colorPalette: colorPalette});
      setBadges(newBadges);
    }
    
  return (
    <Flex direction="column" width="100%" height="100vh" alignItems="center" className="dashboard">
        {pageState === 'init' && pageLocation === 'dashboard' && (
          <>
          <div className="main-motto dashboard-header">Lorem Ipsum</div>
            <Flex direction="column" width="100%" height="100vh" alignItems="center" className="dashboard">
            <CentralSearchFrame feature={mainSearchBar} currentBadges={badges} changeBadges={(text,color) => {modifyBadges(text,color)}} searchFunction={navigateToRecipes}/>
            <Toolbar click={[()=>{changePageState('ingSearch')}]}/>
            </Flex>
          </>
        ) }
        {
            pageState === 'ingSearch' && pageLocation === 'dashboard' && (
              <>
              <div className="main-motto dashboard-header">Lorem Ipsum</div>
              <CentralSearchFrame feature={DynamicForm} featureProps={{ prevState: ()=>{changePageState('init')} }} currentBadges={badges} changeBadges={(text,color) => {modifyBadges(text,color)}}/>
              </>
              // <CentralSearchFrame feature={DynamicForm} featureProps={{ prevState: ()=>{changePageState('dashboard')} }} currentBadges={badges} changeBadges={(text,color) => {modifyBadges(text,color)}}/>
            )
        }
      <Routes>

        <Route path="recipes" element={<RecipeCardContainer recipes={recipes}/>} />
        <Route path="recipe" element={<RecipeDetails recipe={recipe}/>} />

      </Routes>
    </Flex>
  );
};