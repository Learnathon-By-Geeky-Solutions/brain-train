'use client';
import React from 'react';
import {
  Box,
  IconButton,
  Text,
  VStack,
  useBreakpointValue,
  Drawer,
  useDisclosure,
  Tooltip,
    Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Menu as MenuIcon,
  ArrowLeft,
  ArrowRight,
  Home,
  User,
  Settings
} from 'lucide-react';

const MotionBox = motion(Box);

const navItems = [
  { label: 'Home', icon: <Home size={18} /> },
  { label: 'Profile', icon: <User size={18} /> },
  { label: 'Settings', icon: <Settings size={18} /> }
];

const SidebarContent = ({ isOpen, onToggle, isMobile }) => {
  return (
    // <Flex 
    //     direction="column"
    // >
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
    // </Flex>
  );
};

const CollapsibleSideBar = ({ open, onToggle }) => {
  const drawerDisclosure = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            aria-label="Open menu"
            icon={<MenuIcon />}
            onClick={drawerDisclosure.onOpen}
            m={2}
            position="fixed"
            top={2}
            left={2}
            zIndex={999}
            colorScheme="purple"
          />

          <Drawer.Root
            isOpen={drawerDisclosure.open}
            placement="left"
            onClose={drawerDisclosure.onClose}
          >
            <Drawer.Backdrop />
            <Drawer.Content>
              <Drawer.Body p={0}>
                <SidebarContent isOpen={true} onToggle={drawerDisclosure.onClose} isMobile />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        </>
      ) : (
        <SidebarContent isOpen={open} onToggle={onToggle} />
      )}
    </>
  );
};

export default CollapsibleSideBar;
