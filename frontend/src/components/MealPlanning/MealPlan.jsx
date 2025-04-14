import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Text,
  Image,
  VStack,
  Flex,
  Heading,
  IconButton,
} from '@chakra-ui/react';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import { useColorModeValue } from '../ui/color-mode';
import MealPlanningSidebar from './SideNavBar';
import { formatMealPlanDateRange, getCurrentDateFormatted, getDaysOfWeek, getOffsetDate, getOtherWeekStartDate } from './dateFormatter';
import { getMealData } from './api';
import PlanController from './AddMealPlan';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DailyMealPlan from './DailyMealPlan';
import { Toaster } from '../ui/toaster'
import handleRecipeDetail from '../RecipeCard/api';


const MealPlanningCalendar = () => {
  const [startDate, setStartDate] = useState(getCurrentDateFormatted());
  const [reload, setReload] = useState(false);
  const [days, setDays] = useState(getDaysOfWeek(startDate));
  const [mealData, setMealData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('reload in useEffect in mealplan');
    setDays(getDaysOfWeek(startDate));
    getMealData(startDate, 'week').then((data) => {
      if(data.status !== 'error'){
        console.log('Fetched meal data: ');
        console.log(data);
        setMealData(data.plans);
      }
    });
  }, [reload]);


  const initialStartDate = getCurrentDateFormatted();
  const mealTimes = ['Morning', 'Noon', 'Evening'];
  
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');
  const highlightColor = useColorModeValue('orange.400', 'orange.500');

  function changeStartDate(date){
    setStartDate(date);
    toggleReload();
  }

  function setPreviousWeek(){
    const prevStartDate = getOtherWeekStartDate(startDate,false);
    changeStartDate(prevStartDate);
  }

  function setNextWeek(){
    const nxtStartDate = getOtherWeekStartDate(startDate,true);
    changeStartDate(nxtStartDate);
  }

  function toggleReload(){
    setReload(!reload);
  }
  
  return (
    <Flex>
      <MealPlanningSidebar 
        setStartDate={changeStartDate}
        reload={reload}
        setSearchParams={setSearchParams}
        setReload={setReload}
      />
      {!searchParams.get("time") ? (<Box maxW="100%" overflowX="auto" pt={0}>
        {/* Calendar Header with Navigation */}
        <Flex 
          justify="space-between" 
          align="center" 
          py={2} 
          px={4} 
          bg="gray.400"
        >
          <IconButton 
            aria-label="Previous week"  
            variant="ghost"
            onClick={setPreviousWeek}
          >
              <LuArrowLeft />
          </IconButton>
          <Heading size="md">{formatMealPlanDateRange(startDate)}</Heading>
          <IconButton 
            aria-label="Next week" 
            variant="ghost"
            onClick={setNextWeek}
          >
              <LuArrowRight />
          </IconButton>
        </Flex>
        
        {/* Calendar Grid */}
        <Grid templateColumns="80px repeat(7, 1fr)">
          {/* Day Headers */}
          <Box p={4} borderWidth="1px" borderColor={borderColor}></Box>
          {days.map((day,dayIndex) => {
            const dayKey = day.toLowerCase();
            const mealSize = mealData[dayKey]?.mealPlan?.meals?.length;
            return (
            <Box 
              key={day} 
              p={4} 
              textAlign="center" 
              borderWidth="1px" 
              borderColor={borderColor}
              bg={bgColor}
            >
              <Text fontWeight="medium">{day}</Text>
              {
                !mealSize && startDate >= getCurrentDateFormatted() && (
                  <Flex h="100%" placeContent="center">
                    <PlanController  
                      currentDate={getOffsetDate(startDate,dayIndex)}
                      startDate={initialStartDate}
                      toggleReload={toggleReload}
                    />
                  </Flex>
                )
              }
            </Box>
          )})}
          
          {/* Meal Time Rows */}
          {mealTimes.map((mealTime,index) => (
            <React.Fragment key={mealTime}>
              {/* Meal Time Label */}
              <Box 
                p={4} 
                borderWidth="1px" 
                borderColor={borderColor} 
                bg="gray.400"
              >
                <Text 
                  fontSize="sm" 
                  fontWeight="medium" 
                  transform="rotate(-90deg)" 
                  h="150px" 
                  display="flex" 
                  alignItems="center" 
                  justifyContent="center"
                >
                  {mealTime}
                </Text>
              </Box>
              
              {/* Meal Cells for Each Day */}
              {days.map((day,dayIndex) => {
                const dayKey = day.toLowerCase();
                const meal = mealData[dayKey]?.mealPlan?.meals?.[index] || { title: '', image: '' };
                
                return (
                  <Box 
                    key={`${day}-${mealTime}`} 
                    borderWidth="1px" 
                    borderColor={borderColor}
                    h="150px"
                    position="relative"
                    overflow="hidden"
                  >
                    {meal.title && (
                      <Box 
                        position="relative"
                        h="full"
                        onClick={() => {
                          console.log('getting recipe detail from meal plan');
                          handleRecipeDetail(meal.recipeId,navigate);
                        }
                        }
                      >
                        {meal.image && (
                          <Image 
                            src={meal.image} 
                            alt={meal.title}
                            objectFit="cover"
                            w="full"
                            h="full"
                            opacity="0.9"
                          />
                        )}
                        <Box 
                          position="absolute"
                          bottom="0"
                          left="0"
                          right="0"
                          bg={highlightColor}
                          p={2}
                          color="white"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          h="10"
                          _hover={{height: "auto"}}
                          transition="height 0.5s ease"
                        >
                          <Text 
                            fontSize="sm" 
                            fontWeight="medium"
                          >
                            {meal.title}
                          </Text>
                        </Box>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </React.Fragment>
          ))}
          
          {/* Summary Row */}
          <Box 
            p={4} 
            borderWidth="1px" 
            borderColor={borderColor} 
            bg="gray.400"
          >
            <Text 
              fontSize="sm" 
              fontWeight="medium" 
              transform="rotate(-90deg)" 
              h="120px" 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
            >
              Summary
            </Text>
          </Box>
          
          {/* Nutrition Summary for Each Day */}
          {days.map((day) => {
            const dayKey = day.toLowerCase();
            let newNutrients = {protein: 0, carbohydrates: 0, fat: 0, calories: 0};
            
            if(mealData[dayKey])
            for (const nutrient of mealData[dayKey]?.mealPlan?.nutrients ?? []) {
              newNutrients[nutrient.name] = nutrient.amount;
            }
            
            // const nutrition = mealData[dayKey]?.mealPlan?.nutrients 
            
            return (
              <VStack 
                key={`${day}-summary`} 
                p={2} 
                borderWidth="1px" 
                borderColor={borderColor}
                align="start"
                spacing={0}
                fontSize="xs"
              >
                <Text>Calories: {newNutrients?.calories}</Text>
                <Text>Fat: {newNutrients?.fat}g</Text>
                <Text>Protein: {newNutrients?.protein}g</Text>
                <Text>Carbs: {newNutrients?.carbohydrates}g</Text>
              </VStack>
            );
          })}
        </Grid>
      </Box>)
      :
      (<DailyMealPlan searchParams={searchParams} reload={reload}/>) 
      }
      <Toaster />
    </Flex>
  );
};

export default MealPlanningCalendar;