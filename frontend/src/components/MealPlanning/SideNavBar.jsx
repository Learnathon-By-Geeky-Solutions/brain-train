import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  VStack,
  Heading,
  Flex,
  Avatar,
  Separator,
  Collapsible,
  List,
} from '@chakra-ui/react';

import { useColorModeValue } from '../ui/color-mode';
import { LuCalendar, LuClipboard, LuMenu } from 'react-icons/lu';
import { MdDateRange } from 'react-icons/md';
import { getMyPlans } from './api';
import { getCurrentDateFormatted } from './dateFormatter';
import NavItem from './NavItem';
import {renderPlanList} from './PlanList';



const MealPlanningSidebar = ({setStartDate,reload,setSearchParams,setReload}) => {

  const [dailyPlanList, setDailyPlanList] = useState([]);
  const [weeklyPlanList, setweeklyPlanList] = useState([]);
  const [isActiveIdx,setIsActiveIdx] = useState(0);

  useEffect(() => {
    console.log('reload in useEffect in mealplan sidenavbar');
    getMyPlans().then((data) => {
      if(data.status === 'error'){
        console.error('Failed to fetch plans in 1st useEffect: ');
        console.log('Data: ');
        console.log(data);
        setDailyPlanList([]);
        setweeklyPlanList([]);
      }
      else{
        console.log('Fetched plans from 1st useEffect: ');
        console.log(data);
        setDailyPlanList(data.dailyPlans);
        setweeklyPlanList(data.weeklyPlans);
      }
    });
  }, [reload]);


  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      w="96"
      h="100vh"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      p={4}
      position="sticky"
      top="0"
      overflowY="auto"
    >
      {/* Header/Logo */}
      <Flex mb={6} align="center">
        <Avatar.Root bg="green.500"> <LuMenu fontSize="1.2rem" color="white" /> </Avatar.Root>
        <Heading size="md" ml={3}>Meal Planner</Heading>
      </Flex>

      <Separator mb={3} />

      {/* Main Navigation */}
      <VStack spacing={2} align="stretch" mb={6}>
        <NavItem
          idx={0}
          isActiveIdx={isActiveIdx}
          setIsActiveIdx={setIsActiveIdx}
          clickFn={() => {
            setSearchParams({});
            setStartDate(getCurrentDateFormatted());
          }}
        >
          <Flex gap={1}>
            <LuCalendar />
            Weekly Calendar
          </Flex>
        </NavItem>
        <NavItem
          idx={1}
          isActiveIdx={isActiveIdx}
          setIsActiveIdx={setIsActiveIdx}
          clickFn={() => {
            setSearchParams({ time: 'day', date: getCurrentDateFormatted() });
          }
        }
        >
          <Flex gap={1}>
            <MdDateRange />
            Today's Plan
          </Flex>
        </NavItem>
        
        <Collapsible.Root>
          <Collapsible.Trigger w="100%">
          <NavItem
            idx={2}
            isActiveIdx={isActiveIdx}
            setIsActiveIdx={setIsActiveIdx}
          >
          <Flex gap={1}>
            <LuClipboard />
            My Plans
          </Flex>
          </NavItem>
          </Collapsible.Trigger>
          <Collapsible.Content>
          <List.Root py="2" px="5" variant="plain" fontSize="sm" gap={2} alignItems="start">
            {renderPlanList(dailyPlanList,setIsActiveIdx,isActiveIdx,setReload,reload,"day")}
            {renderPlanList(weeklyPlanList,setIsActiveIdx,isActiveIdx,setReload,reload,"week",setStartDate)}
          </List.Root>
          </Collapsible.Content>
        </Collapsible.Root>
      </VStack>
    </Box>
  );
};
MealPlanningSidebar.propTypes = {
  setStartDate: PropTypes.func.isRequired,
  reload: PropTypes.bool.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  setReload: PropTypes.func.isRequired,
};

export default MealPlanningSidebar;