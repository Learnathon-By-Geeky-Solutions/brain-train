import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Image,
  Badge,
  Card,
  Stat,
  Separator,
  Flex,
} from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import { getMealData } from './api';
import { formatDate, getCurrentDateFormatted, getDay } from './dateFormatter';
import { useNavigate } from 'react-router-dom';
import handleRecipeDetail from '../RecipeCard/api';


const DailyMealPlan = ({searchParams,reload}) => {
  
  let day = getDay(searchParams.get('date'));
  const [meals, setMeals] = useState([]);
  const [nutrients, setNutrients] = useState({});
  const navigate = useNavigate();
  let isToday = searchParams.get('date') === getCurrentDateFormatted();

  useEffect(() => {
    getMealData(searchParams.get('date'), 'day').then((data) => {
      if(data.status === 'error'){
        console.error('Failed to fetch meal data from reload ', data.msg);
        console.log('Data: ');
        console.log(data);
        setMeals([]);
        setNutrients({protein: "", carbohydrates: "", fat: "", calories: ""});
      }
      else{
        console.log('Fetched meal data from reload ');
        console.log(data);
        const plan =  data.plans?.[0]?.mealPlan;
        setMeals(plan?.meals || []);
        let newNutrients = {protein: "", carbohydrates: "", fat: "", calories: ""};
        if(plan)
        for (const nutrient of plan.nutrients) {
          newNutrients[nutrient.name] = nutrient.amount;
        }
        setNutrients(newNutrients);
      }
    });
  }, [searchParams,reload]);

  // Colors based on light/dark mode
  const cardBg = useColorModeValue('white', 'gray.800');
  const headerBg = useColorModeValue('blue.50', 'blue.900');
  const todayBadgeBg = useColorModeValue('green.100', 'green.800');
  const todayBadgeColor = useColorModeValue('green.800', 'green.100');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const nutritionBg = useColorModeValue('gray.50', 'gray.700');
  
  // Meal types with their corresponding labels and colors
  const mealTypes = [
    { label: 'Breakfast', color: 'yellow' },
    { label: 'Lunch', color: 'orange' },
    { label: 'Dinner', color: 'purple' },
  ];
  
  return (
    <Card.Root 
      boxShadow="md" 
      borderRadius="lg" 
      overflow="hidden" 
      bg={cardBg}
      borderWidth="1px"
      borderColor={isToday ? "blue.400" : borderColor}
      width="100%"
    >
      <Card.Header 
        bg={headerBg} 
        py={3}
        px={4}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <VStack alignItems="flex-start" spacing={0}>
            <Heading size="md">{day}</Heading>
            {searchParams.get('date') && <Text fontSize="sm" color="gray.500">{formatDate(searchParams.get('date'))}</Text>}
          </VStack>
          {isToday && (
            <Badge 
              bg={todayBadgeBg} 
              color={todayBadgeColor} 
              borderRadius="full" 
              px={2}
            >
              Today
            </Badge>
          )
        }
        </HStack>
      </Card.Header>

      {nutrients && (
        <Box p={3} bg={nutritionBg} borderBottomWidth="1px" borderColor={borderColor}>
          <Text fontSize="md" fontWeight="medium" mb={1}>Nutrition Summary</Text>
          <Flex direction="row" wrap="wrap" gap={4}>
            <Stat.Root size="sm">
              <Stat.Label fontSize="xs">Calories</Stat.Label>
              <Stat.ValueText fontSize="md">{Math.round(nutrients.calories)}</Stat.ValueText>
            </Stat.Root>
            <Stat.Root size="sm">
              <Stat.Label fontSize="xs">Protein</Stat.Label>
              <Stat.ValueText fontSize="md">{Math.round(nutrients.protein)}g</Stat.ValueText>
            </Stat.Root>
            <Stat.Root size="sm">
              <Stat.Label fontSize="xs">Carbs</Stat.Label>
              <Stat.ValueText fontSize="md">{Math.round(nutrients.carbohydrates)}g</Stat.ValueText>
            </Stat.Root>
            <Stat.Root size="sm">
              <Stat.Label fontSize="xs">Fat</Stat.Label>
              <Stat.ValueText fontSize="md">{Math.round(nutrients.fat)}g</Stat.ValueText>
            </Stat.Root>
            </Flex>
        </Box>
      )}
      
      <Card.Body p={4}>
        <VStack spacing={4} align="stretch">
          {meals?.length > 0 ? (
            meals?.map((meal, index) => (
              <Box 
                key={`${day}-meal-${index}`}
                onClick={() => {
                  handleRecipeDetail(meal.recipeId, navigate);
                }
                }
              >
                {index > 0 && <Separator my={2} />}
                <HStack>
                  <Badge 
                    colorScheme={mealTypes[index % mealTypes.length].color} 
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {mealTypes[index % mealTypes.length].label}
                  </Badge>
                </HStack>
                
                <Flex direction="row" mt={2} gap={4}>
                  {meal?.image && (
                    <Image 
                      src={meal.image} 
                      fallbackSrc="https://via.placeholder.com/80"
                      alt={meal.title}
                      boxSize="80px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  )}
                  <Flex direction="column" justifyContent="center" alignItems="center" h="100%">
                    <Text fontWeight="medium">{meal.title}</Text>
                  </Flex>
                </Flex>
              </Box>
            ))
          ) : (
            <Box textAlign="center" py={4}>
              <Text color="gray.500">No meals planned for this day</Text>
            </Box>
          )}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
DailyMealPlan.propTypes = {
  searchParams: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }).isRequired,
  reload: PropTypes.bool.isRequired,
};

export default DailyMealPlan;