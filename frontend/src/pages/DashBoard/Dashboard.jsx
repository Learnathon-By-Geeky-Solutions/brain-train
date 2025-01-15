import { Box, Flex, Icon, IconButton, Span, Image, Input } from '@chakra-ui/react';
import DynamicForm from '@/components/DynamicFormInput/DynamicFormInput';
import { useState } from 'react';
import { LuSearch, LuActivity, LuAlarmClockCheck } from 'react-icons/lu';
import RecipeCardContainer from '@/components/RecipeCardContainer/RecipeCardContainer';
import RecipeDetails from '@/components/RecipeDetails/RecipeDetails';

import './Dashboard.css';
import CentralSearchFrame from '@/components/CentralSearchFrame/CentralSearchFrame';
import Toolbar from '@/components/Toolbar/Toolbar';
import { text } from '@fortawesome/fontawesome-svg-core';

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
    const recipes = generateDummyRecipes();
    const [pageState, setPageState] = useState('dashboard');

    function changePageState(newState){
        setPageState(newState);
    }

    const mainSearchBar = () => { return ( <Input placeholder="Search..." background="none" border="none" _focus={{border: "none", boxShadow: "none"}} variant="flushed" /> ) };
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
      <div className="main-motto dashboard-header">Lorem Ipsum</div>
        {pageState === 'dashboard' && (
            <Flex direction="column" width="100%" height="100vh" alignItems="center" className="dashboard">
            <CentralSearchFrame feature={mainSearchBar} currentBadges={badges} changeBadges={(text,color) => {modifyBadges(text,color)}} />
            <Toolbar click={[()=>{changePageState('ingSearch')}]}/>
            </Flex>
        ) }
        {
            pageState === 'ingSearch' && (
              <CentralSearchFrame feature={DynamicForm} featureProps={{ prevState: ()=>{changePageState('dashboard')} }} currentBadges={badges} changeBadges={(text,color) => {modifyBadges(text,color)}}/>
            )
        }
        {/* <RecipeCardContainer recipes={recipes} /> */}
        {/* <RecipeDetails recipe={recipe} /> */}
    </Flex>
  );
};