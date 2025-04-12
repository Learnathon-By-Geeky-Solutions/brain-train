import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Flex,
  Avatar,
  Separator,
  Collapsible,
  List,
  Menu,
  Portal,
} from '@chakra-ui/react';

import { useColorModeValue } from '../ui/color-mode';
import { LuCalendar, LuClipboard, LuCog, LuMenu, LuPlus, LuRepeat, LuSearch, LuStar } from 'react-icons/lu';
import { MdDateRange } from 'react-icons/md';
import { deletePlan, getMyPlans } from './api';
import { formatDate, formatMealPlanDateRange, getCurrentDateFormatted } from './dateFormatter';
import NavItem from './NavItem';



const MealPlanningSidebar = ({setStartDate,reload,setSearchParams,setReload}) => {

  const [dailyPlanList, setDailyPlanList] = useState([]);
  const [weeklyPlanList, setweeklyPlanList] = useState([]);
  const [isActiveIdx,setIsActiveIdx] = useState(0);

  // useEffect(() => {
  //   getMyPlans().then((data) => {
  //     if(data.status === 'error'){
  //       console.error('Failed to fetch plans in 1st useEffect: ');
  //       console.log('Data: ');
  //       console.log(data);
  //       setDailyPlanList([]);
  //       setweeklyPlanList([]);
  //     }
  //     else{
  //       console.log('Fetched plans from 1st useEffect: ');
  //       console.log(data.plans);
  //       setDailyPlanList(data.plans.daily);
  //       setweeklyPlanList(data.plans.weekly);
  //     }
  //   }
  //   );
  // },[]);

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
        console.log(data.plans);
        setDailyPlanList(data.plans.daily);
        setweeklyPlanList(data.plans.weekly);
      }
    });
  }, [reload]);


  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const activeBg = useColorModeValue('green.50', 'green.900');
  const activeColor = useColorModeValue('green.700', 'green.200');

  function getPlanString(plan){
    if(plan?.time === 'week'){
      return formatMealPlanDateRange(plan.startDate);
    }
    else{
      return formatDate(plan.startDate);
    }
  }

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
            {dailyPlanList.map((plan,index) => (
              <Menu.Root>
                <Menu.ContextTrigger>
                  <List.Item
                     bg={isActiveIdx === 20 + index ? activeBg : 'transparent'}
                     color={isActiveIdx === 20 + index ? activeColor : undefined}
                    _hover={{ bg: hoverBg, cursor: 'pointer' }}
                    onClick={() => {
                      setSearchParams({ time: 'day', date: plan.startDate });
                      setIsActiveIdx(20+index);
                    }}
                  >
                    {plan.title}
                  </List.Item>
                </Menu.ContextTrigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item
                      onClick={() => {
                        deletePlan(plan._id,'day').then((data) => {
                          if(data.status === 'error'){
                            console.error('Failed to delete plan: ');
                            console.log(data);
                          }
                          else{
                            console.log('Deleted plan: ');
                            console.log(data);
                            setReload(!reload);
                          }
                        }
                        );
                      }}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
              </Menu.Root>
            ))}
            {weeklyPlanList.map((plan,index) => (
              <Menu.Root>
                <Menu.ContextTrigger>
                  <List.Item
                    bg={isActiveIdx === 30 + index ? activeBg : 'transparent'}
                    color={isActiveIdx === 30 + index ? activeColor : undefined}
                    _hover={{ bg: hoverBg, cursor: 'pointer' }}
                    onClick={() => {
                      setStartDate(plan.startDate);
                      setSearchParams({});
                      setIsActiveIdx(30+index);
                    }}
                  >
                    {plan.title}
                  </List.Item>
                </Menu.ContextTrigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item
                      onClick={() => {
                        deletePlan(plan._id,'week').then((data) => {
                          if(data.status === 'error'){
                            console.error('Failed to delete plan: ');
                            console.log(data);
                          }
                          else{
                            console.log('Deleted plan: ');
                            console.log(data);
                            setReload(!reload);
                          }
                        }
                        );
                      }}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
              </Menu.Root>
            ))}
          </List.Root>
          </Collapsible.Content>
        </Collapsible.Root>
      </VStack>
    </Box>
  );
};

export default MealPlanningSidebar;