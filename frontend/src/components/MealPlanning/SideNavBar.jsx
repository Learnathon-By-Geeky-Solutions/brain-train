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

  const [planList, setPlanList] = useState([]);
  const [isActiveIdx,setIsActiveIdx] = useState(0);

  useEffect(() => {
    getMyPlans().then((data) => {
      if(data.status === 'error'){
        console.error('Failed to fetch plans in 1st useEffect: ', data.msg);
        console.log('Data: ', data);
        setPlanList([]);
      }
      else{
        console.log('Fetched plans from 1st useEffect: ', data.plans);
        setPlanList(data.plans);
      }
    }
    );
  },[]);

  useEffect(() => {
    console.log('reload in useEffect in mealplan sidenavbar');
    if(!reload) return;
    getMyPlans().then((data) => {
      if(data.status === 'error'){
        console.error('Failed to fetch plans in useEffect: ', data.msg);
        console.log('Data: ', data);
        setPlanList([]);
      }
      else{
        console.log('Fetched plans from useEffect: ', data.plans);
        setPlanList(data.plans);
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
            {planList.map((plan,index) => (
              <Menu.Root>
                <Menu.ContextTrigger>
                  <List.Item
                     bg={isActiveIdx === 20 + index ? activeBg : 'transparent'}
                     color={isActiveIdx === 20 + index ? activeColor : undefined}
                    _hover={{ bg: hoverBg, cursor: 'pointer' }}
                    onClick={() => {
                      if(plan?.time === 'week'){
                        // setStartDate(plan.startDate);
                        setSearchParams({});
                      }
                      else{
                        setSearchParams({ time: 'day', date: plan.startDate, id: plan._id });
                      }
                      setIsActiveIdx(20+index);
                    }}
                  >
                    {getPlanString(plan)}
                  </List.Item>
                </Menu.ContextTrigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item
                      onClick={() => {
                        deletePlan(plan._id).then((data) => {
                          if(data.status === 'error'){
                            console.error('Failed to delete plan: ');
                            console.log(data);
                          }
                          else{
                            console.log('Deleted plan: ');
                            console.log(data);
                            setReload(true);
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