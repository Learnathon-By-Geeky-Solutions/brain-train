import React, { useState } from 'react';
import {
  Box,
  Grid,
  Text,
  Image,
  VStack,
  HStack,
  Flex,
  Heading,
  IconButton,
} from '@chakra-ui/react';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import { useColorModeValue } from '../ui/color-mode';
import MealPlanningSidebar from './SideNavBar';
import { formatMealPlanDateRange, getDaysOfWeek, getOtherWeekStartDate } from './dateFormatter';


// Sample meal data structure
const sampleMealData = {
  startDate: '2025-03-31',
  monday: {
    meals:[
        { title: '', image: '' },
        { title: '', image: '' },
        { title: '', image: '' }
    ],
    nutrients:{
        "calories": 2003.28,
        "protein": 123.23,
        "fat": 147.31,
        "carbohydrates": 49.37
    }
  },
  tuesday: {
    meals:[
        { title: 'Chicken Caesar Salad', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
        { 
            title: 'Coffee & Banana with Peanut Butter', 
            image: 'https://images.unsplash.com/photo-1592663527359-cf6642f54cff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' 
        },
        { title: '', image: '' }
    ],
    nutrients:{
        "calories": 2003.28,
        "protein": 123.23,
        "fat": 147.31,
        "carbohydrates": 49.37
    }
  },
  wednesday: {
    meals:[
        { title: '', image: '' },
        { title: '', image: '' },
        { title: '', image: '' }
    ],
    nutrients:{
        "calories": 2003.28,
        "protein": 123.23,
        "fat": 147.31,
        "carbohydrates": 49.37
    }
  },
  thursday: {
    meals:[
        { title: '', image: '' },
        { title: '', image: '' },
        { title: '', image: '' }
    ],
    nutrients:{
        "calories": 2003.28,
        "protein": 123.23,
        "fat": 147.31,
        "carbohydrates": 49.37
    }
  },
  friday: {
    meals:[
        { title: '', image: '' },
        { title: '', image: '' },
        { title: '', image: '' }
    ],
    nutrients:{
        "calories": 2003.28,
        "protein": 123.23,
        "fat": 147.31,
        "carbohydrates": 49.37
    }
  },
  saturday: {
    meals:[
        { title: '', image: '' },
        { title: '', image: '' },
        { title: '', image: '' }
    ],
    nutrients:{
        "calories": 2003.28,
        "protein": 123.23,
        "fat": 147.31,
        "carbohydrates": 49.37
    }
  },
  sunday: {
    meals:[
        { title: '', image: '' },
        { title: '', image: '' },
        { title: '', image: '' }
    ],
    nutrients:{
        "calories": 2003.28,
        "protein": 123.23,
        "fat": 147.31,
        "carbohydrates": 49.37
    }
  },


};

const MealPlanningCalendar = () => {
  const [startDate, setStartDate] = useState(sampleMealData.startDate);
  const days = getDaysOfWeek(startDate);
  const mealTimes = ['Morning', 'Noon', 'Evening'];
  
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');
  const highlightColor = useColorModeValue('orange.400', 'orange.500');

  function setPreviousWeek(){
    const prevStartDate = getOtherWeekStartDate(startDate,false);
    setStartDate(prevStartDate);
  }

  function setNextWeek(){
    const nxtStartDate = getOtherWeekStartDate(startDate,true);
    setStartDate(nxtStartDate);
  }
  
  return (
    <Flex>
      <MealPlanningSidebar />
      <Box maxW="100%" overflowX="auto" pt={0}>
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
          {days.map((day) => (
            <Box 
              key={day} 
              p={4} 
              textAlign="center" 
              borderWidth="1px" 
              borderColor={borderColor}
              bg={bgColor}
            >
              <Text fontWeight="medium">{day}</Text>
            </Box>
          ))}
          
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
              {days.map((day) => {
                const dayKey = day.toLowerCase();
                const meal = sampleMealData[dayKey]?.meals?.[index] || { title: '', image: '' };
                
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
                        >
                          <Text fontSize="sm" fontWeight="medium">
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
            const nutrition = sampleMealData[dayKey]?.nutrients 
            
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
                <Text>Calories: {nutrition.calories}</Text>
                <Text>Fat: {nutrition.fat}g</Text>
                <Text>Protein: {nutrition.protein}g</Text>
                <Text>Carbs: {nutrition.carbohydrates}g</Text>
              </VStack>
            );
          })}
        </Grid>
      </Box>
    </Flex>
  );
};

export default MealPlanningCalendar;