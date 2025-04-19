"use client";
import React from "react";
import {
  IconButton,
  useBreakpointValue,
  Drawer,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { Menu as MenuIcon } from "lucide-react";
import SideBarContent from "./SideBarContent";
import PropType from "prop-types";

const CollapsibleSideBar = ({
  open,
  onToggle,
  navItems,
  loadChat,
  clearChat,
  toggleRefresh,
}) => {
  const drawerDisclosure = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {isMobile ? (
        <Flex>
          <IconButton
            aria-label="Open menu"
            onClick={drawerDisclosure.onOpen}
            m={2}
            position="fixed"
            top={2}
            left={2}
            zIndex={999}
            colorScheme="purple"
          >
            <MenuIcon />
          </IconButton>

          <Drawer.Root
            isOpen={drawerDisclosure.open}
            placement="left"
            onClose={drawerDisclosure.onClose}
          >
            <Drawer.Backdrop />
            <Drawer.Content>
              <Drawer.Body p={0}>
                <SideBarContent
                  isOpen={true}
                  onToggle={drawerDisclosure.onClose}
                  navItems={navItems}
                  loadChat={loadChat}
                  clearChat={clearChat}
                  toggleRefresh={toggleRefresh}
                />
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Root>
        </Flex>
      ) : (
        <SideBarContent
          isOpen={open}
          onToggle={onToggle}
          navItems={navItems}
          loadChat={loadChat}
          clearChat={clearChat}
          toggleRefresh={toggleRefresh}
        />
      )}
    </>
  );
};

CollapsibleSideBar.propTypes = {
  open: PropType.bool.isRequired,
  onToggle: PropType.func.isRequired,
  navItems: PropType.array.isRequired,
  loadChat: PropType.func.isRequired,
  clearChat: PropType.func.isRequired,
  toggleRefresh: PropType.func.isRequired,
};

export default CollapsibleSideBar;
