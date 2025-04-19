import React from 'react';
import {
  Box,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Menu as MenuIcon,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

const MotionBox = motion(Box);

const SideBarContent = ({ isOpen, onToggle, isMobile, navItems }) => {
  return (
    <MotionBox
      w={isOpen ? "25vw" : "5vw"}
      bg="purple.600"
      color="white"
      transition="width 0.3s"
      overflow="hidden"
      h="full"
      position="fixed"
      top="10vh"
      p={3}
    >
      <IconButton
        aria-label="Toggle sidebar"
        icon={isOpen ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        onClick={onToggle}
        size="sm"
        mb={6}
        bg="purple.500"
        _hover={{ bg: 'purple.400' }}
      />

      <VStack spacing={4} align="stretch">
        {navItems.map((item, idx) => (
            <Box
              display="flex"
              alignItems="center"
              px={2}
              py={2}
              _hover={{ bg: 'purple.500', cursor: 'pointer' }}
              borderRadius="md"
            >
              {item.icon}
              {isOpen && <Text ml={3}>{item.label}</Text>}
            </Box>
        ))}
      </VStack>
    </MotionBox>
  );
};

export default SideBarContent;