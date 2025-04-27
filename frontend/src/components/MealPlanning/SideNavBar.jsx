import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  VStack,
  Heading,
  Flex,
  Avatar,
  Separator,
  Collapsible,
  List,
} from "@chakra-ui/react";

import { useColorModeValue } from "../ui/color-mode";
import { LuCalendar, LuClipboard, LuMenu } from "react-icons/lu";
import { MdDateRange } from "react-icons/md";
import { getMyPlans } from "./api";
import { getCurrentDateFormatted } from "./dateFormatter";
import NavItem from "./NavItem";
import { renderPlanList } from "./PlanList";

const MealPlanningSidebar = ({
  setStartDate,
  reload,
  setSearchParams,
  setReload,
  isActiveIdx,
  setIsActiveIdx,
  isActivePlanIdx,
  setIsActivePlanIdx,
}) => {
  const [dailyPlanList, setDailyPlanList] = useState([]);
  const [weeklyPlanList, setweeklyPlanList] = useState([]);

  useEffect(() => {
    getMyPlans().then((data) => {
      if (data.status === "error") {
        setDailyPlanList([]);
        setweeklyPlanList([]);
      } else {
        setDailyPlanList(
          data.dailyPlans.map((plan) => {
            return { ...plan, type: "day" };
          }),
        );
        setweeklyPlanList(
          data.weeklyPlans.map((plan) => {
            return { ...plan, type: "week" };
          }),
        );
      }
    });
  }, [reload]);

  const borderColor = useColorModeValue("gray.200", "gray.700");

  const toggleReload = () => {
    setReload((prev) => !prev);
  };

  return (
    <Box
      w={{ base: "100vw", sm: "100vw", md: "96" }}
      minH={{ base: "20vh", sm: "20vh", md: "100vh" }}
      bg="none"
      borderRight="1px"
      borderColor={borderColor}
      p={4}
      position={{ base: "fixed", sm: "fixed", md: "sticky" }}
      top={{ base: "5vh", sm: "5vh", md: "0" }}
      left="0"
      overflowY="auto"
    >
      {/* Header/Logo */}
      <Flex mb={6} align="center">
        <Avatar.Root bg="green.500">
          {" "}
          <LuMenu fontSize="1.2rem" color="white" />{" "}
        </Avatar.Root>
        <Heading size="md" ml={3}>
          Meal Planner
        </Heading>
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
          setIsActivePlanIdx={setIsActivePlanIdx}
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
            setSearchParams({
              time: "day",
              date: getCurrentDateFormatted(),
              idx: 1,
              sIdx: -1,
            });
          }}
          setIsActivePlanIdx={setIsActivePlanIdx}
        >
          <Flex gap={1}>
            <MdDateRange />
            Today&apos;s Plan
          </Flex>
        </NavItem>

        <Collapsible.Root>
          <Collapsible.Trigger w="100%">
            <NavItem
              idx={2}
              isActiveIdx={isActiveIdx}
              setIsActiveIdx={setIsActiveIdx}
              setIsActivePlanIdx={setIsActivePlanIdx}
            >
              <Flex gap={1}>
                <LuClipboard />
                My Plans
              </Flex>
            </NavItem>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <List.Root
              py="1"
              px="5"
              variant="plain"
              fontSize="sm"
              gap={2}
              alignItems="start"
            >
              <Flex
                direction="column"
                overflowY={{ base: "auto", sm: "auto", md: "hidden" }}
                h={{ base: "8", sm: "8", md: "100%" }}
                w="100%"
                position={{ base: "fixed", sm: "fixed", md: "sticky" }}
                gap={2}
                alignItems="start"
              >
                {renderPlanList(
                  dailyPlanList,
                  setIsActiveIdx,
                  toggleReload,
                  isActivePlanIdx,
                  setIsActivePlanIdx,
                  0,
                )}
                {renderPlanList(
                  weeklyPlanList,
                  setIsActiveIdx,
                  toggleReload,
                  isActivePlanIdx,
                  setIsActivePlanIdx,
                  dailyPlanList.length,
                  setStartDate,
                )}
              </Flex>
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
  isActiveIdx: PropTypes.number.isRequired,
  setIsActiveIdx: PropTypes.func.isRequired,
  isActivePlanIdx: PropTypes.number.isRequired,
  setIsActivePlanIdx: PropTypes.func.isRequired,
};

export default MealPlanningSidebar;
