import React from "react";
import PropTypes from "prop-types";
import { Button, Text, Flex } from "@chakra-ui/react";

import { useColorModeValue } from "../ui/color-mode";

// Navigation Item component
const NavItem = ({
  children,
  clickFn,
  idx,
  isActiveIdx,
  setIsActiveIdx,
  setIsActivePlanIdx,
}) => {
  const activeBg = useColorModeValue("green.50", "green.900");
  const activeColor = useColorModeValue("green.700", "green.200");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Button
      variant="ghost"
      justifyContent="flex-start"
      alignItems="center"
      fontWeight={isActiveIdx === idx ? "semibold" : "normal"}
      py={3}
      px={4}
      borderRadius="md"
      bg={isActiveIdx === idx ? activeBg : "transparent"}
      color={isActiveIdx === idx ? activeColor : undefined}
      _hover={{ bg: isActiveIdx === idx ? activeBg : hoverBg }}
      w="100%"
      onClick={() => {
        if (clickFn) clickFn();
        if (idx !== 2) {
          setIsActiveIdx(idx);
          setIsActivePlanIdx(-1);
        }
      }}
    >
      <Flex justify="space-between" w="100%" align="center">
        <Text>{children}</Text>
      </Flex>
    </Button>
  );
};
NavItem.propTypes = {
  children: PropTypes.node.isRequired,
  clickFn: PropTypes.func,
  idx: PropTypes.number.isRequired,
  isActiveIdx: PropTypes.number.isRequired,
  setIsActiveIdx: PropTypes.func.isRequired,
  setIsActivePlanIdx: PropTypes.func.isRequired,
};

export default NavItem;
