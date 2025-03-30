import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Button,
  Text,
  Flex,
  Avatar,
  Badge,
  Separator,
  IconButton,
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
import { useSearchParams } from 'react-router-dom';


const MealPlanningSidebar = ({setStartDate,reload,setSearchParams,setReload}) => {

  const [planList, setPlanList] = useState(getMyPlans());
  const [isActiveIdx,setIsActiveIdx] = useState(0);

  useEffect(() => {
    console.log('reload in useEffect in mealplan sidenavbar');
    if(!reload) return;
    setPlanList(getMyPlans());
  }, [reload]);


  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const activeBg = useColorModeValue('green.50', 'green.900');
  const activeColor = useColorModeValue('green.700', 'green.200');

  function getPlanString(plan){
    if(plan.time === 'week'){
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

      <Separator mb={6} />

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
                      if(plan.time === 'week'){
                        // setStartDate(plan.startDate);
                        setSearchParams({});
                      }
                      else{
                        setSearchParams({ time: 'day', date: plan.startDate });
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
                        deletePlan(plan.id);
                        setReload(true);
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

      <Separator mb={6} />

      {/* Recipe Collections */}
      <Box mb={6}>
        <Heading size="xs" textTransform="uppercase" mb={4} color="gray.500">
          Recipe Collections
        </Heading>
        <VStack spacing={2} align="stretch">
          <CollectionItem name="Breakfast Ideas" count={18} />
          <CollectionItem name="Quick Lunches" count={23} />
          <CollectionItem name="Family Dinners" count={42} />
          <CollectionItem name="Healthy Snacks" count={15} />
          <Button  
            variant="ghost" 
            justifyContent="flex-start" 
            size="sm"
            color="gray.500"
          >
            {/* <AddIcon /> */}
            Add Collection
          </Button>
        </VStack>
      </Box>

      <Separator mb={6} />

      {/* Actions */}
      <VStack spacing={3} align="stretch">
        <IconButton variant="outline">
           <LuPlus />
          Add New Recipe
        </IconButton>
        <IconButton variant="outline">
            <LuCog />
          Settings
        </IconButton>
      </VStack>
    </Box>
  );
};

// Navigation Item component
const NavItem = ({ children, clickFn, idx, isActiveIdx, setIsActiveIdx }) => {
  const activeBg = useColorModeValue('green.50', 'green.900');
  const activeColor = useColorModeValue('green.700', 'green.200');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Button
      variant="ghost"
      justifyContent="flex-start"
      alignItems="center"
      fontWeight={isActiveIdx === idx ? "semibold" : "normal"}
      py={3}
      px={4}
      borderRadius="md"
      role="group"
      bg={isActiveIdx === idx ? activeBg : 'transparent'}
      color={isActiveIdx === idx ? activeColor : undefined}
      _hover={{ bg: isActiveIdx === idx ? activeBg : hoverBg }}
      w="100%"
      onClick={()=>{
        if(clickFn)
          clickFn();
        if(idx != 2)
          setIsActiveIdx(idx);
      }}
    >
      <Flex justify="space-between" w="100%" align="center">
        <Text>{children}</Text>
      </Flex>
    </Button>
  );
};

// Collection Item component
const CollectionItem = ({ name, count }) => {
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  
  return (
    <Button
      variant="ghost"
      justifyContent="flex-start"
      py={2}
      px={4}
      borderRadius="md"
      role="group"
      _hover={{ bg: hoverBg }}
      w="100%"
      size="sm"
    >
      <Flex justify="space-between" w="100%" align="center" gap={1}>
        <Text>{name}</Text>
        <Badge colorScheme="gray" borderRadius="full">
          {count}
        </Badge>
      </Flex>
    </Button>
  );
};

export default MealPlanningSidebar;